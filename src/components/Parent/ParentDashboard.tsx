import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import AddStudent from './AddStudent';
import { Student, Mark } from '../../types';
import MarksOverview from './MarksOverview';
import MarksChart from '../Charts/MarksChart';

interface ParentDashboardProps {
  activeTab: 'dashboard' | 'view-marks';
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ activeTab }) => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [recentMarks, setRecentMarks] = useState<{ [studentId: string]: Mark | null }>({});
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [allMarks, setAllMarks] = useState<Mark[]>([]);

  // Fetch students for this parent
  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('parent_id', user.id);
      if (!error && data) {
        setStudents(data.map((s: any) => ({
          id: s.id,
          name: s.name,
          class: s.class,
          section: s.section,
          rollNumber: s.roll_number,
          parentId: s.parent_id,
        })));
      }
      setLoading(false);
    };
    fetchStudents();
  }, [user]);

  // Fetch recent marks for all students
  useEffect(() => {
    const fetchRecentMarks = async () => {
      if (students.length === 0) return;
      const marksByStudent: { [studentId: string]: Mark | null } = {};
      for (const student of students) {
        const { data, error } = await supabase
          .from('marks')
          .select('*')
          .eq('student_id', student.id)
          .order('date', { ascending: false })
          .limit(1);
        if (!error && data && data.length > 0) {
          const m = data[0];
          marksByStudent[student.id] = {
            id: m.id,
            studentId: m.student_id,
            subject: m.subject,
            examType: m.exam_type,
            marks: m.marks,
            totalMarks: m.total_marks,
            date: m.date,
            teacherId: m.teacher_id,
          };
        } else {
          marksByStudent[student.id] = null;
        }
      }
      setRecentMarks(marksByStudent);
    };
    if (activeTab === 'dashboard') {
      fetchRecentMarks();
    }
  }, [students, activeTab]);


  // Fetch all marks for selected student (for both dashboard and view-marks tab)
  useEffect(() => {
    const fetchMarks = async () => {
      if (!selectedStudent) return setAllMarks([]);
      const { data, error } = await supabase
        .from('marks')
        .select('*')
        .eq('student_id', selectedStudent.id);
      if (!error && data) {
        setAllMarks(data.map((m: any) => ({
          id: m.id,
          studentId: m.student_id,
          subject: m.subject,
          examType: m.exam_type,
          marks: m.marks,
          totalMarks: m.total_marks,
          date: m.date,
          teacherId: m.teacher_id,
        })));
      }
    };
    if (selectedStudent) {
      fetchMarks();
    }
  }, [selectedStudent]);

  // Refresh students after adding
  const handleStudentAdded = () => {
    if (user?.id) {
      supabase
        .from('students')
        .select('*')
        .eq('parent_id', user.id)
        .then(({ data, error }) => {
          if (!error && data) {
            setStudents(data.map((s: any) => ({
              id: s.id,
              name: s.name,
              class: s.class,
              section: s.section,
              rollNumber: s.roll_number,
              parentId: s.parent_id,
            })));
          }
        });
    }
  };

  const subjects = [...new Set(allMarks.map(mark => mark.subject))];

  return (
    <div className="space-y-6">
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Your Children</h2>
            {loading ? (
              <div>Loading students...</div>
            ) : students.length === 0 ? (
              <div>No students found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`bg-blue-50 p-4 rounded-lg border border-blue-200 flex flex-col gap-2 cursor-pointer transition-all ${selectedStudent?.id === student.id ? 'ring-2 ring-emerald-400' : ''}`}
                    onClick={() => {
                      setSelectedStudent(student);
                    }}
                  >
                    <div className="font-semibold text-gray-800">{student.name}</div>
                    <div className="text-sm text-gray-600">Class {student.class}{student.section} • Roll: {student.rollNumber}</div>
                    {recentMarks[student.id] ? (
                      <div className="mt-2 text-blue-800 text-sm">
                        Recent: {recentMarks[student.id]?.subject} - {recentMarks[student.id]?.marks}/{recentMarks[student.id]?.totalMarks}
                      </div>
                    ) : (
                      <div className="mt-2 text-gray-400 text-sm">No marks yet</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {selectedStudent && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              {allMarks.length === 0 ? (
                <div className="text-gray-400 text-center py-8">No marks found for this student.</div>
              ) : (
                <>
                  <MarksOverview marks={allMarks} studentName={selectedStudent.name} />
                  {allMarks.length > 0 && (
                    <div className="space-y-6 mt-6">
                      <h2 className="text-xl font-bold text-gray-800">Subject-wise Progress</h2>
                      <MarksChart
                        marks={allMarks.map(m => ({
                          subject: m.subject,
                          exam: m.examType,
                          percentage: (m.marks / m.totalMarks) * 100
                        }))}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'view-marks' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Select a Student</h2>
            <select
              className="w-full p-2 border rounded mb-4"
              value={selectedStudent?.id || ''}
              onChange={e => {
                const student = students.find(s => s.id === e.target.value);
                setSelectedStudent(student || null);
              }}
            >
              <option value="">-- Select --</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
            {selectedStudent && (
              <>
                <MarksOverview marks={allMarks} studentName={selectedStudent.name} />
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Subject-wise Progress</h2>
                  {subjects.map(subject => (
                    <MarksChart
                      key={subject}
                      subject={subject}
                      marks={allMarks
                        .filter(m => m.subject === subject)
                        .map(m => ({
                          exam: m.examType,
                          percentage: (m.marks / m.totalMarks) * 100
                        }))
                      }
                    />

                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;