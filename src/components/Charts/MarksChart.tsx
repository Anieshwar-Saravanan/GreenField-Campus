
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface MarksChartProps {
  marks: { subject: string; exam: string; percentage: number }[];
  isAverage?: boolean;
}

const COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ef4444", "#14b8a6"];

const MarksChart: React.FC<MarksChartProps> = ({ marks, isAverage = false }) => {
  // Get all unique subjects and exams
  const subjects = Array.from(new Set(marks.map(m => m.subject)));
  const exams = Array.from(new Set(marks.map(m => m.exam)));

  // Transform data: [{ subject: 'Math', 'Class Test': 80, 'Unit Test': 85, ... }, ...]
  const chartData = subjects.map(subject => {
    const subjectMarks = marks.filter(m => m.subject === subject);
    const entry: any = { subject };
    exams.forEach(exam => {
      const mark = subjectMarks.find(m => m.exam === exam);
      entry[exam] = mark ? mark.percentage : null;
    });
    return entry;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject-wise Marks Chart</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="subject"
            stroke="#666"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#666" fontSize={12} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          {exams.map((exam, idx) => (
            <Line
              key={exam}
              type="monotone"
              dataKey={exam}
              stroke={COLORS[idx % COLORS.length]}
              strokeWidth={3}
              dot={{ fill: COLORS[idx % COLORS.length], strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: COLORS[idx % COLORS.length], strokeWidth: 2 }}
              name={exam}
              connectNulls
            />
          ))}
          <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" label="Target: 75%" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarksChart;
