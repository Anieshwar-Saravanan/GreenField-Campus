import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { examTypeLabels } from '../../data/mockData';
import { sortClassStrings } from '../../lib/classSort';
import { PlusCircle, Save, CheckCircle } from 'lucide-react';
import { Student } from '../../types';
import { useAuth } from '../../context/AuthContext';

const EnterMarks: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    examType: '',
    marks: '',
    totalMarks: '100',
    date: new Date().toISOString().split('T')[0],
  });
  // State for adding parent
  // const [parentForm, setParentForm] = useState({
  //   name: '',
  //   email: '',
  // });
  // const [parentAddMsg, setParentAddMsg] = useState<string | null>(null);
  // const [parentAddError, setParentAddError] = useState<string | null>(null);
  // // Add parent handler
  // const handleParentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setParentForm({ ...parentForm, [e.target.name]: e.target.value });
  // };

  // const handleAddParent = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setParentAddMsg(null);
  //   setParentAddError(null);
  //   // Insert parent into users table with role 'parent'
  //   const { error } = await supabase.from('users').insert([
  //     {
  //       name: parentForm.name,
  //       email: parentForm.email,
  //       role: 'parent',
  //       is_verified: false,
  //     },
  //   ]);
  //   if (error) {
  //     setParentAddError(error.message || 'Failed to add parent.');
  //     return;
  //   }
  //   setParentAddMsg('Parent added successfully!');
  //   setParentForm({ name: '', email: '' });
  // };
  //parent section ends
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const subjects = ['Mathematics', 'Science', 'English', 'Physics', 'Chemistry', 'Biology', 'Social Science', 'Commerce', 'Computer Science', 'Accountancy', 'Computer Application','Economics','Business maths','Tamil','French'];

  // Get unique classes from students list
  const classOptions = sortClassStrings(Array.from(new Set(students.map((s) => s.class))));
  // Get unique sections for the selected class
  const sectionOptions = selectedClass
    ? Array.from(new Set(students.filter((s) => s.class === selectedClass).map((s) => s.section))).sort()
    : [];

  // Fetch all students from Supabase
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('students').select('*');
      if (!error && data) {
        setStudents(data.map((s: any) => ({
          id: s.id,
          name: s.name,
          class: s.class,
          section: s.section ? s.section.charAt(0).toUpperCase() + s.section.slice(1).toLowerCase() : '',
          rollNumber: s.roll_number,
          parentId: s.parent_id,
        })));
      }
      setLoading(false);
    };
    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    // Duplicate check: prevent inserting marks if one already exists for
    // the same student, subject and exam type.
    try {
      const { data: existing } = await supabase
        .from('marks')
        .select('id')
        .eq('student_id', formData.studentId)
        .eq('subject', formData.subject)
        .eq('exam_type', formData.examType)
        .eq('date', formData.date)
        .limit(1);

      if (existing && existing.length > 0) {
        setErrorMsg('Marks already exist for this student, subject and test.');
        return;
      }
    } catch (dupErr) {
      console.warn('Duplicate check failed:', dupErr);
    }
    // Find the selected student and capitalize their section
    const selectedStudent = students.find((s) => s.id === formData.studentId);
    let sectionToSend = '';
    if (selectedStudent && selectedStudent.section) {
      sectionToSend = selectedStudent.section.charAt(0).toUpperCase() + selectedStudent.section.slice(1).toLowerCase();
    }
    // Insert marks into Supabase with teacher_id and capitalized section
    const { error } = await supabase.from('marks').insert([
      {
        student_id: formData.studentId,
        subject: formData.subject,
        exam_type: formData.examType,
        marks: Number(formData.marks),
        total_marks: Number(formData.totalMarks),
        date: formData.date,
        teacher_id: user?.id || null,
        // section: sectionToSend,
      },
    ]);

    if (error) {
      setErrorMsg(error.message || 'Failed to add marks.');
      console.error('Supabase insert error:', error);
      return;
    }

    // If marks entry is successful, ensure teacher <-> student links
    try {
      const teacherId = user?.id;
      const targetStudentId = formData.studentId;

      if (teacherId && targetStudentId) {
        // Check if teacher is already linked to this student
        const { data: existingLink, error: linkError } = await supabase
          .from('student_teacher')
          .select('id')
          .eq('student_id', targetStudentId)
          .eq('teacher_id', teacherId)
          .maybeSingle();

        if (linkError) {
          console.warn('Error checking student_teachers link:', linkError);
        }

        // If no link exists, link all students in the same class+section to this teacher
        if (!existingLink) {
          // get the class and section of the selected student
          const { data: stud, error: studErr } = await supabase
            .from('students')
            .select('id, class, section')
            .eq('id', targetStudentId)
            .maybeSingle();

          if (studErr) {
            console.warn('Error fetching student info for linking:', studErr);
          }

          if (stud && stud.class) {
            const classVal = stud.class;
            const sectionVal = stud.section;

            // fetch all students in that class+section
            let query = supabase.from('students').select('id');
            query = query.eq('class', classVal);
            if (sectionVal) query = query.eq('section', sectionVal);
            const { data: classStudents, error: classStudentsErr } = await query;

            if (classStudentsErr) {
              console.warn('Error fetching class students for linking:', classStudentsErr);
            } else if (classStudents && classStudents.length > 0) {
              // get existing links for these students to avoid duplicate inserts
              const studentIds = classStudents.map((s: any) => s.id);
                const { data: existingLinks, error: existingLinksErr } = await supabase
                .from('student_teacher')
                .select('student_id')
                .in('student_id', studentIds)
                .eq('teacher_id', teacherId);

              if (existingLinksErr) {
                console.warn('Error fetching existing student_teachers links:', existingLinksErr);
              }

              const alreadyLinkedIds = new Set((existingLinks || []).map((r: any) => r.student_id));
              const toInsert = studentIds
                .filter((id: any) => !alreadyLinkedIds.has(id))
                .map((id: any) => ({ student_id: id, teacher_id: teacherId }));

              if (toInsert.length > 0) {
                const { error: insertLinksErr } = await supabase.from('student_teacher').insert(toInsert);
                if (insertLinksErr) {
                  console.warn('Error inserting student_teacher links:', insertLinksErr);
                }
              }
            }
          }
        }
      }
    } catch (linkingErr) {
      console.warn('Unexpected error while linking students to teacher:', linkingErr);
    }

    // If marks entry is successful, send email to parent
    const { data: studentData } = await supabase
      .from('students')
      .select('name, parent_id')
      .eq('id', formData.studentId)
      .single();

    if (studentData && studentData.parent_id) {
      // Get parent email
      await supabase
        .from('users')
        .select('email')
        .eq('id', studentData.parent_id)
        .single();
      // ...existing code for email (commented)...
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        studentId: '',
        subject: '',
        examType: '',
        marks: '',
        totalMarks: '100',
        date: new Date().toISOString().split('T')[0],
      });
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle class change
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
    setSelectedSection('');
    setFormData((prev) => ({ ...prev, studentId: '' })); // Reset student selection
  };

  // Handle section change
  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSection(e.target.value);
    setFormData((prev) => ({ ...prev, studentId: '' })); // Reset student selection
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Marks Submitted Successfully!</h2>
          <p className="text-gray-600">The marks have been recorded</p>
        </div>
      </div>
    );
  }

  // Show error if present
  if (errorMsg) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl text-red-600">!</span>
          </div>
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-gray-600">{errorMsg}</p>
          <button
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => setErrorMsg(null)}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
          <PlusCircle className="h-7 w-7 text-blue-600" />
          <span>Enter Student Marks</span>
        </h1>

        {/* Add Parent Section */}
        {/* <div className="mb-10 p-6 bg-emerald-50 rounded-lg border border-emerald-200">
          <h2 className="text-lg font-bold text-emerald-700 mb-4">Add Parent</h2>
          <form onSubmit={handleAddParent} className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
              <input
                type="text"
                name="name"
                value={parentForm.name}
                onChange={handleParentInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
              <input
                type="email"
                name="email"
                value={parentForm.email}
                onChange={handleParentInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow"
            >
              Add Parent
            </button>
          </form>
          {parentAddMsg && <div className="text-green-700 mt-2">{parentAddMsg}</div>}
          {parentAddError && <div className="text-red-600 mt-2">{parentAddError}</div>}
        </div> */}

        {/* ...existing code for marks entry form... */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Class selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={handleClassChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a class</option>
                {classOptions.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            {/* Section selection, depends on class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Section
              </label>
              <select
                value={selectedSection}
                onChange={handleSectionChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!selectedClass}
              >
                <option value="">{selectedClass ? 'Choose a section' : 'Select class first'}</option>
                {sectionOptions.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            {/* Student selection, filtered by class and section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student
              </label>
              <select
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!selectedClass || !selectedSection}
              >
                <option value="">{selectedClass && selectedSection ? 'Choose a student' : 'Select class & section first'}</option>
                {students
                  .filter((student) => student.class === selectedClass && student.section === selectedSection)
                  .map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.class}{student.section}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Type
              </label>
              <select
                name="examType"
                value={formData.examType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select exam type</option>
                {Object.entries(examTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marks Obtained
              </label>
              <input
                type="number"
                name="marks"
                value={formData.marks}
                onChange={handleInputChange}
                min="0"
                max={formData.totalMarks}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter marks"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Marks
              </label>
              <input
                type="number"
                name="totalMarks"
                value={formData.totalMarks}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Total marks"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Submit Marks</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnterMarks;