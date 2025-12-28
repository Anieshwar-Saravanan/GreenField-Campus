import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { sortClassObjects } from '../../lib/classSort';
import MarksChart from '../Charts/MarksChart';
import { Users, TrendingUp } from 'lucide-react';

const StudentPerformance: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [classOptions, setClassOptions] = useState<{class: string, section: string}[]>([]);
  const [selectedClass, setSelectedClass] = useState<{class: string, section: string} | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const { data: studentsData } = await supabase.from('students').select('*');
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
      setClassOptions(sortClassObjects(options));
      if (options.length > 0) setSelectedClass(options[0]);
      setLoading(false);
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    const fetchMarks = async () => {
      const filteredStudents = students.filter((s: any) => s.class === selectedClass.class && s.section === selectedClass.section);
      const studentIds = filteredStudents.map((s: any) => s.id);
      const { data: marksData } = await supabase
        .from('marks')
        .select('*')
        .in('student_id', studentIds);
      setMarks(marksData || []);
      setLoading(false);
    };
    fetchMarks();
  }, [selectedClass, students]);

  // Students in selected class-section
  const filteredStudents = selectedClass
    ? students.filter((s: any) => s.class === selectedClass.class && s.section === selectedClass.section)
    : [];

  // Marks for selected student
  const studentMarks = selectedStudent
    ? marks.filter((m: any) => m.student_id === selectedStudent.id)
    : [];
  const subjects = Array.from(new Set(studentMarks.map(m => m.subject)));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Student Performance</h1>
        <p className="text-gray-600">Select a class and student to view performance.</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
        <select
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          value={selectedClass ? `${selectedClass.class}-${selectedClass.section}` : ''}
          onChange={e => {
            const [cls, sec] = e.target.value.split('-');
            setSelectedClass({ class: cls, section: sec });
            setSelectedStudent(null);
          }}
        >
          {classOptions.map(opt => (
            <option key={`${opt.class}-${opt.section}`} value={`${opt.class}-${opt.section}`}>{opt.class}{opt.section}</option>
          ))}
        </select>
      </div>
      {selectedClass && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Students</h2>
          {filteredStudents.length === 0 ? (
            <p className="text-gray-500">No students found for this class.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map(student => (
                <button
                  key={student.id}
                  className={`bg-gray-50 p-4 rounded-lg border border-gray-200 w-full text-left shadow hover:bg-emerald-50 transition-all ${selectedStudent?.id === student.id ? 'border-emerald-500' : ''}`}
                  onClick={() => setSelectedStudent(student)}
                >
                  <h3 className="font-semibold text-gray-800">{student.name}</h3>
                  <p className="text-sm text-gray-600">Class {student.class}{student.section} • Roll: {student.roll_number}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {selectedStudent && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{selectedStudent.name}'s Performance</h2>
          {subjects.length === 0 ? (
            <p className="text-gray-500">No marks found for this student.</p>
          ) : (
            <>
              <div className="mb-6">
                <MarksChart
                  marks={studentMarks.map((mark: any) => ({
                    subject: mark.subject,
                    exam: mark.exam_type,
                    percentage: Number(((mark.marks / mark.total_marks) * 100).toFixed(1))
                  }))}
                />
              </div>
              {/* Table of all marks for this student */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-2">
                  <thead>
                    <tr className="bg-emerald-100">
                      <th className="p-1">Subject</th>
                      <th className="p-1">Exam</th>
                      <th className="p-1">Marks</th>
                      <th className="p-1">Total</th>
                      <th className="p-1">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentMarks.map((m: any) => (
                      <tr key={m.id}>
                        <td className="p-1">{m.subject}</td>
                        <td className="p-1">{m.exam_type}</td>
                        <td className="p-1">{m.marks}</td>
                        <td className="p-1">{m.total_marks}</td>
                        <td className="p-1">{m.date ? new Date(m.date).toLocaleDateString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentPerformance;
