import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Users, BookOpen, TrendingUp, Settings, UserCheck, GraduationCap } from 'lucide-react';
import { Student, Mark } from '../../types';

// Simple Modal component
const Modal: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
        {children}
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: studentsData, error: studentsError } = await supabase.from('students').select('*');
        const { data: marksData, error: marksError } = await supabase.from('marks').select('*');
        if (studentsError || marksError) {
          setError('Error loading data');
        }
        setStudents(studentsData || []);
        // Map snake_case to camelCase for marks
        setMarks((marksData || []).map((m: any) => ({
          id: m.id,
          studentId: m.student_id,
          subject: m.subject,
          examType: m.exam_type,
          marks: m.marks,
          totalMarks: m.total_marks,
          date: m.date,
          teacherId: m.teacher_id,
        })));
      } catch (e) {
        setError('Error loading data');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Helper to get most recent mark for a student
  const getRecentMark = (studentId: string) => {
    const studentMarks = marks.filter(m => m.studentId === studentId);
    if (studentMarks.length === 0) return null;
    return studentMarks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  };

  // Helper to get overall average for a student
  const getAverage = (studentId: string) => {
    const studentMarks = marks.filter(m => m.studentId === studentId);
    if (studentMarks.length === 0) return null;
    const avg = studentMarks.reduce((sum, m) => sum + (m.marks / m.totalMarks) * 100, 0) / studentMarks.length;
    return avg.toFixed(1);
  };

  const totalStudents = students.length;
  const uniqueExams = new Set(marks.map(mark => `${mark.subject}-${mark.examType}`));
  const totalMarks = uniqueExams.size;

  // Calculate average for 10th and 12th grade
  const getGradeAverage = (grade: string) => {
    const gradeMarks = marks.filter(mark => {
      const student = students.find(s => s.id === mark.studentId);
      return student && student.class === grade;
    });
    if (gradeMarks.length === 0) return null;
    return (gradeMarks.reduce((sum, mark) => sum + (mark.marks / mark.totalMarks) * 100, 0) / gradeMarks.length).toFixed(1);
  };

  const average10 = getGradeAverage('10');
  const average12 = getGradeAverage('12');

  const getRecentActivity = () => {
    return marks
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  };

  const recentActivity = getRecentActivity();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! Here's your school overview.</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}
      {loading && (
        <div className="text-center text-gray-500">Loading...</div>
      )}
      {!loading && students.length === 0 && (
        <div className="text-center text-gray-500">No students found.</div>
      )}
      {!loading && marks.length === 0 && (
        <div className="text-center text-gray-500">No marks found.</div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">10th Grade Avg</p>
              <p className="text-2xl font-bold text-gray-800">{average10 !== null ? `${average10}%` : '-'}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">12th Grade Avg</p>
              <p className="text-2xl font-bold text-gray-800">{average12 !== null ? `${average12}%` : '-'}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Grade Averages Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-green-600" />
          <span>Grade Averages</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">10th Grade</h3>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Average</span>
              <span className="font-medium">{average10 !== null ? `${average10}%` : '-'}</span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">12th Grade</h3>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Average</span>
              <span className="font-medium">{average12 !== null ? `${average12}%` : '-'}</span>
            </div>
          </div>
        </div>
      </div>


      {/* Grade Wise Performance */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <Users className="h-6 w-6 text-blue-600" />
          <span>Grade & Section Wise Performance</span>
        </h2>
        {loading ? (
          <div>Loading...</div>
        ) : students.length === 0 ? (
          <div>No students found.</div>
        ) : (
          <div className="space-y-8">
            {Array.from(new Set(students.map(s => s.class))).sort().map(grade => {
              // Get all sections in this grade
              const sections = Array.from(new Set(students.filter(s => s.class === grade).map(s => s.section))).sort();
              return (
                <div key={grade} className="border-b pb-6 last:border-b-0">
                  <h3 className="text-lg font-bold text-gray-700 mb-2">Grade {grade}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-medium text-gray-600">Section</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-600">Average (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sections.map(section => {
                          // Get all students in this grade and section
                          const studentsInSection = students.filter(s => s.class === grade && s.section === section);
                          // Get all marks for these students
                          const sectionMarks = marks.filter(m => studentsInSection.some(s => s.id === m.studentId));
                          let avg = null;
                          if (sectionMarks.length > 0) {
                            avg = (sectionMarks.reduce((sum, m) => sum + (m.marks / m.totalMarks) * 100, 0) / sectionMarks.length).toFixed(1);
                          }
                          return (
                            <tr key={section} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-3 font-medium">{section}</td>
                              <td className="py-2 px-3">{avg !== null ? `${avg}%` : '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {/* <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Settings className="h-6 w-6 text-purple-600" />
          <span>Quick Actions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
            onClick={() => setShowStudentModal(true)}
          >
            <Users className="h-6 w-6 mb-2" />
            <p className="font-medium">Manage Students</p>
          </button>
          <button
            className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
            onClick={() => setShowTeacherModal(true)}
          >
            <UserCheck className="h-6 w-6 mb-2" />
            <p className="font-medium">Manage Teachers</p>
          </button>
          <button
            className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
            onClick={() => setShowSettingsModal(true)}
          >
            <Settings className="h-6 w-6 mb-2" />
            <p className="font-medium">System Settings</p>
          </button>
        </div>
      </div> */}

      {/* Modals */}
      {/* <Modal open={showStudentModal} onClose={() => setShowStudentModal(false)} title="Manage Students">
        <p className="mb-4">Add, edit, or remove students here. (Implement full CRUD as needed.)</p>
        <button className="bg-emerald-500 text-white px-4 py-2 rounded" onClick={() => alert('Add Student form goes here!')}>Add Student</button>
      </Modal>
      <Modal open={showTeacherModal} onClose={() => setShowTeacherModal(false)} title="Manage Teachers">
        <p className="mb-4">Add, edit, or remove teachers here. (Implement full CRUD as needed.)</p>
        <button className="bg-emerald-500 text-white px-4 py-2 rounded" onClick={() => alert('Add Teacher form goes here!')}>Add Teacher</button>
      </Modal>
      <Modal open={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="System Settings">
        <p>Configure system settings here. (Implement settings UI as needed.)</p>
      </Modal> */}
    </div>
  );
};

export default AdminDashboard;