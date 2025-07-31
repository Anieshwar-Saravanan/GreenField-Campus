import React from 'react';
import { Student } from '../../types';
import { User, GraduationCap } from 'lucide-react';

interface StudentSelectorProps {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
}

const StudentSelector: React.FC<StudentSelectorProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
        <GraduationCap className="h-6 w-6 text-emerald-600" />
        <span>Select Student</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {students.map((student) => (
          <button
            key={student.id}
            onClick={() => onSelectStudent(student)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedStudent?.id === student.id
                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                selectedStudent?.id === student.id
                  ? 'bg-emerald-500'
                  : 'bg-gray-400'
              }`}>
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{student.name}</h3>
                <p className="text-sm text-gray-600">
                  Class {student.class}{student.section} • Roll: {student.rollNumber}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentSelector;