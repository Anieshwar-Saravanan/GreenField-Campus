import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import MarksChart from '../Charts/MarksChart';
import { TrendingUp, BookOpen } from 'lucide-react';

const ClassManager: React.FC = () => {
  const [classes, setClasses] = useState<{ class: string; section: string }[]>([]);
  const [selectedClass, setSelectedClass] = useState<{ class: string; section: string } | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await supabase.from('students').select('class, section');
      if (data) {
        const unique = Array.from(
          new Set(data.map((s: any) => `${s.class}-${s.section}`))
        ).map(str => {
          const [cls, sec] = str.split('-');
          return { class: cls, section: sec };
        });
        setClasses(unique);
        if (unique.length > 0) setSelectedClass(unique[0]);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedClass) return;
      setLoading(true);
      const { data: studentsData } = await supabase
        .from('students')
        .select('*')
        .eq('class', selectedClass.class)
        .eq('section', selectedClass.section);
      setStudents(studentsData || []);
      const { data: marksData } = await supabase
        .from('marks')
        .select('*')
        .in('student_id', (studentsData || []).map((s: any) => s.id));
      setMarks(marksData || []);
      setLoading(false);
    };
    fetchData();
  }, [selectedClass]);

  // Get subjects and tests
  const subjects = Array.from(new Set(marks.map((m: any) => m.subject)));
  const examTypes = Array.from(new Set(marks.map((m: any) => m.exam_type)));

  // Calculate averages for each subject and test
  const getAverages = () => {
    return subjects.map(subject => {
      const subjectMarks = marks.filter((m: any) => m.subject === subject);
      const testAverages = examTypes.map(test => {
        const testMarks = subjectMarks.filter((m: any) => m.exam_type === test);
        const avg = testMarks.length > 0
          ? (testMarks.reduce((sum, m) => sum + (m.marks / m.total_marks) * 100, 0) / testMarks.length).toFixed(1)
          : null;
        return { test, avg };
      });
      return { subject, testAverages };
    });
  };

  const averages = getAverages();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Class Manager</h1>
        <p className="text-gray-600">Select a class to view subject and test analytics.</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
        <select
          className="px-3 py-2 border rounded-lg text-lg font-bold text-gray-800 bg-gray-50"
          value={selectedClass ? `${selectedClass.class}-${selectedClass.section}` : ''}
          onChange={e => {
            const [cls, sec] = e.target.value.split('-');
            setSelectedClass({ class: cls, section: sec });
          }}
        >
          {classes.map(opt => (
            <option key={`${opt.class}-${opt.section}`} value={`${opt.class}-${opt.section}`}>{opt.class}{opt.section}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-8">
          {averages.map(({ subject, testAverages }) => (
            <div key={subject} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                {subject}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* For each test, plot the average value for that test in the chart */}
                <MarksChart
                  marks={testAverages
                    .filter(({ avg }) => avg !== null)
                    .map(({ test, avg }) => ({
                      exam: test,
                      percentage: Number(avg),
                    }))}
                  subject={subject}
                  isAverage
                />
                {testAverages.map(({ test, avg }) => (
                  <div key={test} className="bg-white p-3 rounded shadow flex flex-col items-center">
                    <span className="text-sm text-gray-600 mb-1">{test.replace('-', ' ')}</span>
                    <span className="text-xl font-bold text-purple-700">{avg !== null ? `${avg}%` : '-'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassManager;
