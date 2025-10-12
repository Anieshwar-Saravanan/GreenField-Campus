import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Student } from '../../types';

interface MyStudentsProps {
  teacherId: string;
}

const MyStudents: React.FC<MyStudentsProps> = ({ teacherId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    class: '',
    section: '',
    rollNumber: '',
    parentName: '',
  });
  const [parentId, setParentId] = useState('');
  const [parentSearchLoading, setParentSearchLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);
    try {
      // Find parent by name
      setParentSearchLoading(true);
      const { data: parent, error: parentError } = await supabase
        .from('users')
        .select('id')
        .ilike('name', newStudent.parentName.trim());
      setParentSearchLoading(false);
      if (parentError || !parent || parent.length === 0) {
        throw new Error('Parent not found');
      }
      const parentId = parent[0].id;
      // 1. Add student (without teacher_id)
  const { data: studentData, error: studentError } = await supabase.from('students').insert([
        {
          name: newStudent.name,
          class: newStudent.class,
          section: newStudent.section,
          roll_number: newStudent.rollNumber,
          parent_id: parentId,
        },
      ]).select();
      if (studentError || !studentData || studentData.length === 0) throw new Error(studentError?.message || 'Failed to add student');
      const studentId = studentData[0].id;
      // 2. Link student to teacher in join table
      const { error: linkError } = await supabase.from('student_teacher').insert([
        { student_id: studentId, teacher_id: teacherId }
      ]);
      if (linkError) throw new Error(linkError.message);
      setShowAdd(false);
      setNewStudent({ name: '', class: '', section: '', rollNumber: '', parentName: '' });
      fetchStudents();
    } catch (err: any) {
      setAddError(err.message || 'Failed to add student');
    } finally {
      setAddLoading(false);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    // Fetch students for this teacher using join table
    const { data: joinData, error: joinError } = await supabase
      .from('student_teacher')
      .select('student_id, students(*)')
      .eq('teacher_id', teacherId);
    if (!joinError && joinData) {
      setStudents(joinData.map((row: any) => ({
        id: row.students.id,
        name: row.students.name,
        class: row.students.class,
        section: row.students.section,
        rollNumber: row.students.roll_number,
        parentId: row.students.parent_id,
      })));
    } else {
      setStudents([]);
    }
    setLoading(false);
  };

  // State for expanded student and their marks
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [marksByStudent, setMarksByStudent] = useState<{ [studentId: string]: any[] }>({});
  const [marksLoading, setMarksLoading] = useState(false);

  const handleExpandStudent = async (studentId: string) => {
    if (expandedStudentId === studentId) {
      setExpandedStudentId(null);
      return;
    }
    setExpandedStudentId(studentId);
    // Only fetch if not already fetched
    if (!marksByStudent[studentId]) {
      setMarksLoading(true);
      const { data, error } = await supabase
        .from('marks')
        .select('*')
        .eq('student_id', studentId)
        .order('date', { ascending: false });
      setMarksByStudent(prev => ({ ...prev, [studentId]: !error && data ? data : [] }));
      setMarksLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line
  }, [teacherId]);

  // Refresh students after adding
  const handleStudentAdded = () => {
    fetchStudents();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-4">
      <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
        My Students
        <button
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold shadow ml-4"
          onClick={() => setShowAdd((v) => !v)}
        >
          {showAdd ? 'Cancel' : 'Add Student'}
        </button>
      </h2>
      {showAdd && (
        <form onSubmit={handleAddStudent} className="bg-gray-50 p-4 rounded-lg border border-emerald-200 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded"
            value={newStudent.name}
            onChange={e => setNewStudent(s => ({ ...s, name: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Class"
            className="border p-2 rounded"
            value={newStudent.class}
            onChange={e => setNewStudent(s => ({ ...s, class: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Section"
            className="border p-2 rounded"
            value={newStudent.section}
            onChange={e => setNewStudent(s => ({ ...s, section: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Roll Number"
            className="border p-2 rounded"
            value={newStudent.rollNumber}
            onChange={e => setNewStudent(s => ({ ...s, rollNumber: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Parent Name"
            className="border p-2 rounded"
            value={newStudent.parentName}
            onChange={e => setNewStudent(s => ({ ...s, parentName: e.target.value }))}
            required
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-semibold col-span-1 md:col-span-2"
            disabled={addLoading || parentSearchLoading}
          >
            {addLoading || parentSearchLoading ? 'Adding...' : 'Add Student'}
          </button>
          {addError && <div className="col-span-1 md:col-span-2 text-red-600 mt-2">{addError}</div>}
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {loading ? (
          <div>Loading...</div>
        ) : students.length === 0 ? (
          <div>No students found.</div>
        ) : (
          students.map((student) => {
            const isExpanded = expandedStudentId === student.id;
            const marks = marksByStudent[student.id] || [];
            return (
              <div key={student.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <button
                  className="w-full text-left focus:outline-none"
                  onClick={() => handleExpandStudent(student.id)}
                  type="button"
                >
                  <h3 className="font-semibold text-gray-800">{student.name}</h3>
                  <p className="text-sm text-gray-600">
                    Class {student.class}{student.section} • Roll: {student.rollNumber}
                  </p>
                  <span className="text-xs text-emerald-600">{isExpanded ? 'Hide marks' : 'View marks'}</span>
                </button>
                {isExpanded && (
                  <div className="mt-3">
                    {marksLoading && !marks.length ? (
                      <div className="text-gray-400">Loading marks...</div>
                    ) : marks.length === 0 ? (
                      <div className="text-gray-400">No marks found.</div>
                    ) : (
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
                          {marks.map((m: any) => (
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
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyStudents;
