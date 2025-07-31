import React from 'react';
import { Mark } from '../../types';
import { examTypeLabels } from '../../data/mockData';
import { BookOpen, TrendingUp, Award, Target } from 'lucide-react';

interface MarksOverviewProps {
  marks: Mark[];
  studentName: string;
}

const MarksOverview: React.FC<MarksOverviewProps> = ({ marks, studentName }) => {
  const getSubjectStats = () => {
    const subjects = [...new Set(marks.map(mark => mark.subject))];
    return subjects.map(subject => {
      const subjectMarks = marks.filter(mark => mark.subject === subject);
      const average = subjectMarks.reduce((sum, mark) => sum + (mark.marks / mark.totalMarks) * 100, 0) / subjectMarks.length;
      const highest = Math.max(...subjectMarks.map(mark => (mark.marks / mark.totalMarks) * 100));
      const latest = subjectMarks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      return {
        subject,
        average: average.toFixed(1),
        highest: highest.toFixed(1),
        latest: ((latest.marks / latest.totalMarks) * 100).toFixed(1),
        trend: subjectMarks.length >= 2 ? 
          subjectMarks[subjectMarks.length - 1].marks - subjectMarks[subjectMarks.length - 2].marks : 0,
      };
    });
  };

  const getOverallStats = () => {
    const totalPercentage = marks.reduce((sum, mark) => sum + (mark.marks / mark.totalMarks) * 100, 0) / marks.length;
    const examTypeStats = Object.keys(examTypeLabels).map(examType => {
      const examMarks = marks.filter(mark => mark.examType === examType);
      if (examMarks.length === 0) return null;
      const avg = examMarks.reduce((sum, mark) => sum + (mark.marks / mark.totalMarks) * 100, 0) / examMarks.length;
      return {
        type: examTypeLabels[examType as keyof typeof examTypeLabels],
        average: avg.toFixed(1),
        count: examMarks.length,
      };
    }).filter(Boolean);

    return {
      overall: totalPercentage.toFixed(1),
      examTypes: examTypeStats,
    };
  };

  const subjectStats = getSubjectStats();
  const overallStats = getOverallStats();

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-xl text-white">
        <h2 className="text-2xl font-bold mb-2">{studentName}'s Performance</h2>
        <div className="flex items-center space-x-2">
          <Award className="h-8 w-8" />
          <span className="text-3xl font-bold">{overallStats.overall}%</span>
          <span className="text-emerald-100">Overall Average</span>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span>Subject Performance</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectStats.map((stat) => (
            <div key={stat.subject} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3">{stat.subject}</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average</span>
                  <span className="font-medium">{stat.average}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Highest</span>
                  <span className="font-medium text-green-600">{stat.highest}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Latest</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{stat.latest}%</span>
                    {stat.trend !== 0 && (
                      <TrendingUp className={`h-4 w-4 ${stat.trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Type Performance */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Target className="h-6 w-6 text-purple-600" />
          <span>Exam Type Performance</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {overallStats.examTypes.map((examStat) => (
            <div key={examStat?.type} className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">{examStat?.type}</h4>
              <p className="text-2xl font-bold text-purple-600">{examStat?.average}%</p>
              <p className="text-xs text-gray-500">{examStat?.count} exams</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarksOverview;