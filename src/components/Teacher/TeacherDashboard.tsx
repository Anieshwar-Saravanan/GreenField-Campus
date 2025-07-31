import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { BookOpen, Users, TrendingUp, Award } from 'lucide-react';
import MarksChart from '../Charts/MarksChart';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();

  const [teacherStudents, setTeacherStudents] = useState<any[]>([]);
  const [recentMarks, setRecentMarks] = useState<any[]>([]);
  const [classAverage, setClassAverage] = useState('0');
  const [recentTestName, setRecentTestName] = useState('');
  const [allMarks, setAllMarks] = useState<any[]>([]);
  const [classOptions, setClassOptions] = useState<{ class: string, section: string }[]>([]);
  const [selectedClass, setSelectedClass] = useState<{ class: string, section: string } | null>(null);

  // Fetch students and marks initially
  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: studentsData } = await supabase
        .from('students')
        .select('*')
        .eq('teacher_id', user?.id);
      setTeacherStudents(studentsData || []);

      const classSet = new Set<string>();
      (studentsData || []).forEach((s: any) => {
        classSet.add(`${s.class}-${s.section}`);
      });
      const options = Array.from(classSet).map(str => {
        const [cls, sec] = str.split('-');
        return { class: cls, section: sec };
      });
      setClassOptions(options);
      if (!selectedClass && options.length > 0) {
        setSelectedClass(options[0]);
      }

      const { data: marksData } = await supabase
        .from('marks')
        .select('*')
        .eq('teacher_id', user?.id);

      setAllMarks(marksData || []);

      const sortedMarks = (marksData || []).sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setRecentMarks(sortedMarks.slice(0, 5));
    };

    if (user?.id) fetchInitialData();
  }, [user?.id]);

  // Compute class average for selected class
  useEffect(() => {
    if (!selectedClass || !teacherStudents.length || !allMarks.length) return;

    const filteredStudents = teacherStudents.filter(
      s => s.class === selectedClass.class && s.section === selectedClass.section
    );

    const filteredMarks = allMarks.filter(m =>
      filteredStudents.some(s => s.id === m.student_id)
    );

    let recentMark = null;
    if (filteredMarks.length > 0) {
      const sortedByDate = [...filteredMarks].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      recentMark = sortedByDate[0];
    }

    let recentTestLabel = '';
    if (recentMark) {
      recentTestLabel = `${recentMark.subject} (${recentMark.exam_type.replace('-', ' ')})`;
    }
    setRecentTestName(recentTestLabel);

    if (recentMark) {
      const marksForRecent = filteredMarks.filter(
        m =>
          m.subject === recentMark.subject &&
          m.exam_type === recentMark.exam_type
      );

      if (marksForRecent.length > 0) {
        const avg =
          marksForRecent.reduce((sum, m) => sum + (m.marks / m.total_marks) * 100, 0) /
          marksForRecent.length;
        setClassAverage(avg.toFixed(1));
      } else {
        setClassAverage('0');
      }
    } else {
      setClassAverage('0');
    }
  }, [selectedClass, teacherStudents, allMarks]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">
                {selectedClass
                  ? teacherStudents.filter(
                      s =>
                        s.class === selectedClass.class &&
                        s.section === selectedClass.section
                    ).length
                  : 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Class</p>
              <select
                className="px-3 py-2 border rounded-lg text-lg font-bold text-gray-800 bg-gray-50"
                value={selectedClass ? `${selectedClass.class}-${selectedClass.section}` : ''}
                onChange={e => {
                  const [cls, sec] = e.target.value.split('-');
                  setSelectedClass({ class: cls, section: sec });
                }}
              >
                {classOptions.map(opt => (
                  <option key={`${opt.class}-${opt.section}`} value={`${opt.class}-${opt.section}`}>
                    {opt.class}{opt.section}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Class Average<br />
                <span className="text-xs text-gray-400">
                  ({recentTestName || 'No Test'})
                </span>
              </p>
              <p className="text-2xl font-bold text-gray-800">{classAverage}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recently Entered Marks */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Award className="h-6 w-6 text-orange-600" />
          <span>Recently Entered Marks</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Subject</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Exam Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Marks</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentMarks.map((mark: any) => {
                const student = teacherStudents.find((s: any) => s.id === mark.student_id);
                return (
                  <tr key={mark.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{student?.name || mark.student_id}</td>
                    <td className="py-3 px-4">{mark.subject}</td>
                    <td className="py-3 px-4 capitalize">{mark.exam_type.replace('-', ' ')}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        (mark.marks / mark.total_marks) * 100 >= 75 ? 'text-green-600' :
                        (mark.marks / mark.total_marks) * 100 >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {mark.marks}/{mark.total_marks}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(mark.date).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Class Progress Chart (Subjects on x-axis, lines for each test) */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Class Progress</h2>
        {selectedClass ? (
          (() => {
            const filteredStudents = teacherStudents.filter(s =>
              s.class === selectedClass.class && s.section === selectedClass.section
            );
            const filteredMarks = allMarks.filter(m =>
              filteredStudents.some(s => s.id === m.student_id)
            );
            // Transform for MarksChart: [{ subject, exam, percentage }]
            const chartMarks = filteredMarks.map((mark: any) => ({
              subject: mark.subject,
              exam: mark.exam_type,
              percentage: Number(((mark.marks / mark.total_marks) * 100).toFixed(1))
            }));
            return (
              <MarksChart marks={chartMarks} />
            );
          })()
        ) : (
          <p className="text-gray-500">No class selected.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
