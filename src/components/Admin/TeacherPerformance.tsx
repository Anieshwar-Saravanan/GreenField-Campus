import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import MarksChart from '../Charts/MarksChart';
import { Users, TrendingUp } from 'lucide-react';
import { sortClassObjects } from '../../lib/classSort';

const TeacherPerformance: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [classOptions, setClassOptions] = useState<{class: string, section: string}[]>([]);
  const [selectedClass, setSelectedClass] = useState<{class: string, section: string} | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data } = await supabase.from('users').select('*').eq('role', 'teacher');
      setTeachers(data || []);
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (!selectedTeacher?.id) return;

    // reset relevant state while loading new teacher data
    setClassOptions([]);
    setSelectedClass(null);
    setMarks([]);
    setStudents([]);

    const fetchTeacherData = async () => {
      // 1) fetch marks authored by this teacher. Try by `id` first; if none found, try `uuid` (schema differences).
      let allMarks: any[] = [];
      try {
        const { data: marksData, error: marksError } = await supabase
          .from('marks')
          .select('*, students(*)')
          .eq('teacher_id', selectedTeacher.id);
        if (!marksError && marksData && marksData.length > 0) {
          allMarks = marksData;
        } else {
          // try fallback using uuid if available and different
          if (selectedTeacher.uuid && selectedTeacher.uuid !== selectedTeacher.id) {
            const { data: marksData2, error: marksError2 } = await supabase
              .from('marks')
              .select('*, students(*)')
              .eq('teacher_id', selectedTeacher.uuid);
            if (!marksError2 && marksData2 && marksData2.length > 0) {
              allMarks = marksData2;
            } else if (marksError || marksError2) {
              console.warn('Error fetching marks for teacher (both id & uuid):', marksError || marksError2);
            }
          } else if (marksError) {
            console.warn('Error fetching marks for teacher by id:', marksError);
          }
        }
      } catch (e) {
        console.error('Unexpected error fetching marks for teacher:', e);
      }

      // ensure we always have an array
      allMarks = allMarks || [];
      // debug
      console.debug('[TeacherPerformance] fetched marks count for teacher', selectedTeacher.id, allMarks.length, allMarks.slice(0,3));
      setMarks(allMarks);

      // 2) derive unique students. If marks include a joined `students` object use it,
      // otherwise fetch students by the student_id values from marks.
      let uniqueStudents: any[] = [];
      const hasJoinedStudents = allMarks.some((m: any) => m.students && (m.students.id || m.students.uuid));
      if (hasJoinedStudents) {
        const studentMap = new Map<string, any>();
        allMarks.forEach((mark: any) => {
          const sid = mark.students && (mark.students.id || mark.students.uuid);
          if (mark.students && sid) studentMap.set(String(sid), mark.students);
        });
        uniqueStudents = Array.from(studentMap.values());
      } else {
        const studentIds = Array.from(new Set(allMarks.map((m: any) => m.student_id).filter(Boolean)));
        if (studentIds.length > 0) {
          const { data: studentsData, error: studentsError } = await supabase
            .from('students')
            .select('*')
            .in('id', studentIds as any[]);
          if (studentsError) {
            console.error('Error fetching students separately:', studentsError);
          } else {
            uniqueStudents = studentsData || [];
          }
        }
      }
      setStudents(uniqueStudents);

      // 3) build unique class-section pairs from students
      const classSet = new Set<string>();
      uniqueStudents.forEach((s: any) => {
        if (s.class) classSet.add(`${s.class}-${s.section || ''}`);
      });

      // 4) include teacher's assigned class if they are marked as class teacher
      // Try to find the teacher row by `uuid` (some schemas use `uuid`), but fall back to `id` if that fails.
      let teacherRoleData: any = null;
      let teacherRoleError: any = null;
      try {
        const res = await supabase
          .from('teachers')
          .select('is_class_teacher, class, section')
          .eq('user_id', selectedTeacher.id)
          .single();
        teacherRoleData = res.data;
        teacherRoleError = res.error;
      } catch (e) {
        // ignore - we'll try fallback below
      }

      if ((!teacherRoleData || teacherRoleError) && selectedTeacher?.id) {
        // fallback to searching by `id` column if `uuid` didn't return anything
        const res2 = await supabase
          .from('teachers')
          .select('is_class_teacher, class, section')
          .eq('id', selectedTeacher.id)
          .single();
        if (!res2.error) {
          teacherRoleData = res2.data;
          teacherRoleError = res2.error;
        } else {
          // keep the original error if any
          teacherRoleError = teacherRoleError || res2.error;
        }
      }

      if (!teacherRoleError && teacherRoleData?.is_class_teacher && teacherRoleData.class) {
        classSet.add(`${teacherRoleData.class}-${teacherRoleData.section || ''}`);
      }

      console.debug('[TeacherPerformance] derived class options count', classSet.size, 'teacherRole', teacherRoleData);

      const options = Array.from(classSet).map(str => {
        const [cls, sec] = str.split('-');
        return { class: cls, section: sec || '' };
      });

      const sortedOptions = sortClassObjects(options);
      setClassOptions(sortedOptions);

      // 5) select default class: teacher assigned class first, else first option
      if (!teacherRoleError && teacherRoleData?.is_class_teacher && teacherRoleData.class) {
        setSelectedClass({ class: teacherRoleData.class, section: teacherRoleData.section || '' });
      } else if (sortedOptions.length > 0) {
        setSelectedClass(sortedOptions[0]);
      } else {
        setSelectedClass(null);
      }
    };

    fetchTeacherData();
  }, [selectedTeacher]);

  // When a class is selected, ensure we have students for that class.
  // Some schemas don't return joined student objects with marks, so fetch students by class-section to be safe.
  useEffect(() => {
    if (!selectedClass || !selectedTeacher) return;

    const fetchStudentsByClass = async () => {
      try {
        // fetch students by class; filter by section on the client because some DB rows have null/empty section
        const { data: classStudents, error: classStudentsErr } = await supabase
          .from('students')
          .select('*')
          .eq('class', selectedClass.class);

        if (classStudentsErr) {
          console.warn('Error fetching students for selected class:', classStudentsErr);
          return;
        }

        if (classStudents && classStudents.length > 0) {
          // Merge with existing students but prefer the freshly fetched class list for matching
          setStudents(classStudents as any[]);
        }
      } catch (err) {
        console.warn('Unexpected error fetching students by class:', err);
      }
    };

    fetchStudentsByClass();
  }, [selectedClass, selectedTeacher]);

  // Filter students and marks for selected class-section
  // Normalize id comparisons to strings to avoid type mismatches between DB and joined rows
  const filteredStudents = selectedClass
    ? students.filter((s: any) => s.class === selectedClass.class && (s.section || '') === selectedClass.section)
    : [];
  const filteredMarks = marks.filter((m: any) => filteredStudents.some((s: any) => String(s.id) === String(m.student_id)));
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
            const teacher = teachers.find(t => String(t.id) === e.target.value);
            setSelectedTeacher(teacher || null);
          }}
        >
          <option value="">Choose a teacher</option>
          {teachers.map(teacher => (
            <option key={teacher.id} value={String(teacher.id)}>{teacher.name}</option>
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
                value={selectedClass ? JSON.stringify(selectedClass) : ''}
                onChange={e => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setSelectedClass(parsed || null);
                  } catch (err) {
                    // fallback to old parsing if value isn't JSON
                    const [cls, sec] = e.target.value.split('-');
                    setSelectedClass({ class: cls, section: sec || '' });
                  }
                }}
              >
                {classOptions.map(opt => (
                  <option key={`${opt.class}-${opt.section}`} value={JSON.stringify(opt)}>{opt.class}{opt.section}</option>
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

                const chartData = subjectMarks.map(m => ({
                  subject: m.subject,
                  exam: m.exam_type,
                  percentage: (m.marks / m.total_marks) * 100,
                }));

                return (
                <div key={subject} className="border p-4 rounded-lg shadow">
                  <h3 className="text-lg font-bold text-gray-700 mb-2">{subject}</h3>
                  <div style={{ height: '480px' }}>
                    <MarksChart marks={chartData} isAverage />
                  </div>
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
