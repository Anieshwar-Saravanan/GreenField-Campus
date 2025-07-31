import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import MarksChart from '../Charts/MarksChart';
import { Users, TrendingUp } from 'lucide-react';

const TeacherPerformance: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [classOptions, setClassOptions] = useState<{class: string, section: string}[]>([]);
  const [selectedClass, setSelectedClass] = useState<{class: string, section: string} | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data } = await supabase.from('users').select('*').eq('role', 'teacher');
      setTeachers(data || []);
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (!selectedTeacher) return;
    setLoading(true);
    const fetchStudentsAndMarks = async () => {
      const { data: studentsData } = await supabase
        .from('students')
        .select('*')
        .eq('teacher_id', selectedTeacher.id);
      setStudents(studentsData || []);
      // Get all unique class-section pairs
      const classSet = new Set<string>();
      (studentsData || []).forEach((s: any) => {
        classSet.add(`${s.class}-${s.section}`);
      });
      const options = Array.from(classSet).map(str => {
        const [cls, sec] = str.split('-');
        return { class: cls, section: sec };
      });
      setClassOptions(options);
      if (options.length > 0) setSelectedClass(options[0]);
      const { data: marksData } = await supabase
        .from('marks')
        .select('*')
        .eq('teacher_id', selectedTeacher.id);
      setMarks(marksData || []);
      setLoading(false);
    };
    fetchStudentsAndMarks();
  }, [selectedTeacher]);

  // Filter students and marks for selected class-section
  const filteredStudents = selectedClass
    ? students.filter((s: any) => s.class === selectedClass.class && s.section === selectedClass.section)
    : [];
  const filteredMarks = marks.filter((m: any) => filteredStudents.some((s: any) => s.id === m.student_id));
  const subjects = Array.from(new Set(filteredMarks.map(m => m.subject)));

  // Calculate class average for most recent test
  let recentTest = '';
  if (filteredStudents.length > 0 && filteredMarks.length > 0) {
    const examTypesByDate = Array.from(new Set(filteredMarks.map((m: any) => m.exam_type)));
    for (let i = examTypesByDate.length - 1; i >= 0; i--) {
      const testType = examTypesByDate[i];
      const studentsWithMark = filteredStudents.filter((student: any) =>
        filteredMarks.some((m: any) => m.student_id === student.id && m.exam_type === testType)
      );
      if (studentsWithMark.length === filteredStudents.length) {
        recentTest = testType;
        break;
      }
    }
  }
  const marksForRecentTest = filteredMarks.filter((m: any) => m.exam_type === recentTest);
  const classAverage = marksForRecentTest.length > 0
    ? (marksForRecentTest.reduce((sum: number, mark: any) => sum + (mark.marks / mark.total_marks) * 100, 0) / marksForRecentTest.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Teacher Performance</h1>
        <p className="text-gray-600">Select a teacher to view their class performance.</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Teacher</label>
        <select
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          value={selectedTeacher ? selectedTeacher.id : ''}
          onChange={e => {
            const teacher = teachers.find(t => t.id === e.target.value);
            setSelectedTeacher(teacher || null);
          }}
        >
          <option value="">Choose a teacher</option>
          {teachers.map(teacher => (
            <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
          ))}
        </select>
      </div>
      {selectedTeacher && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
              <select
                className="px-3 py-2 border rounded-lg text-lg font-bold text-gray-800 bg-gray-50"
                value={selectedClass ? `${selectedClass.class}-${selectedClass.section}` : ''}
                onChange={e => {
                  const [cls, sec] = e.target.value.split('-');
                  setSelectedClass({ class: cls, section: sec });
                }}
              >
                {classOptions.map(opt => (
                  <option key={`${opt.class}-${opt.section}`} value={`${opt.class}-${opt.section}`}>{opt.class}{opt.section}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600">Class Average<br /><span className="text-xs text-gray-400">({recentTest ? recentTest.replace('-', ' ') : 'No Test'})</span></p>
              <p className="text-2xl font-bold text-gray-800">{classAverage}%</p>
              <TrendingUp className="h-6 w-6 text-purple-600 mt-2" />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{filteredStudents.length}</p>
              <Users className="h-6 w-6 text-blue-600 mt-2" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Class Progress</h2>
          {subjects.length === 0 ? (
            <p className="text-gray-500">No subjects found for this class.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.map(subject => {
                const subjectMarks = filteredMarks
                .filter((mark: any) => mark.subject === subject);

                const examTypes = Array.from(new Set(subjectMarks.map(m => m.exam_type)));

                const chartData = examTypes.map(examType => {
                const examMarks = subjectMarks.filter(m => m.exam_type === examType);
                const avg = examMarks.reduce((sum, m) => sum + (m.marks / m.total_marks) * 100, 0) / examMarks.length;
                return {
                    exam: examType,
                    percentage: Number(avg.toFixed(1))
                };
                });

                return (
                <div key={subject}>
                    <MarksChart marks={chartData} subject={subject} isAverage />
                </div>
                );

              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherPerformance;
