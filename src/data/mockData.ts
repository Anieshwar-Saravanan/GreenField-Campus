import { Student, Mark } from '../types';

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alex Smith',
    class: '10',
    section: 'A',
    rollNumber: '10A01',
    parentId: '1',
  },
  {
    id: '2',
    name: 'Emma Smith',
    class: '12',
    section: 'B',
    rollNumber: '12B15',
    parentId: '1',
  },
];

export const mockMarks: Mark[] = [
  // Alex Smith - Math
  { id: '1', studentId: '1', subject: 'Mathematics', examType: 'class-test', marks: 85, totalMarks: 100, date: '2024-01-15', teacherId: 't1' },
  { id: '2', studentId: '1', subject: 'Mathematics', examType: 'unit-test', marks: 78, totalMarks: 100, date: '2024-02-10', teacherId: 't1' },
  { id: '3', studentId: '1', subject: 'Mathematics', examType: 'quarterly', marks: 92, totalMarks: 100, date: '2024-03-20', teacherId: 't1' },
  { id: '4', studentId: '1', subject: 'Mathematics', examType: 'half-yearly', marks: 88, totalMarks: 100, date: '2024-06-15', teacherId: 't1' },
  
  // Alex Smith - Science
  { id: '5', studentId: '1', subject: 'Science', examType: 'class-test', marks: 76, totalMarks: 100, date: '2024-01-18', teacherId: 't2' },
  { id: '6', studentId: '1', subject: 'Science', examType: 'unit-test', marks: 82, totalMarks: 100, date: '2024-02-12', teacherId: 't2' },
  { id: '7', studentId: '1', subject: 'Science', examType: 'quarterly', marks: 89, totalMarks: 100, date: '2024-03-22', teacherId: 't2' },
  { id: '8', studentId: '1', subject: 'Science', examType: 'half-yearly', marks: 94, totalMarks: 100, date: '2024-06-18', teacherId: 't2' },
  
  // Alex Smith - English
  { id: '9', studentId: '1', subject: 'English', examType: 'class-test', marks: 90, totalMarks: 100, date: '2024-01-20', teacherId: 't3' },
  { id: '10', studentId: '1', subject: 'English', examType: 'unit-test', marks: 87, totalMarks: 100, date: '2024-02-14', teacherId: 't3' },
  { id: '11', studentId: '1', subject: 'English', examType: 'quarterly', marks: 93, totalMarks: 100, date: '2024-03-25', teacherId: 't3' },
  { id: '12', studentId: '1', subject: 'English', examType: 'half-yearly', marks: 91, totalMarks: 100, date: '2024-06-20', teacherId: 't3' },

  // Emma Smith - Physics
  { id: '13', studentId: '2', subject: 'Physics', examType: 'class-test', marks: 88, totalMarks: 100, date: '2024-01-16', teacherId: 't4' },
  { id: '14', studentId: '2', subject: 'Physics', examType: 'unit-test', marks: 84, totalMarks: 100, date: '2024-02-11', teacherId: 't4' },
  { id: '15', studentId: '2', subject: 'Physics', examType: 'quarterly', marks: 91, totalMarks: 100, date: '2024-03-21', teacherId: 't4' },
  { id: '16', studentId: '2', subject: 'Physics', examType: 'half-yearly', marks: 96, totalMarks: 100, date: '2024-06-16', teacherId: 't4' },
  
  // Emma Smith - Chemistry
  { id: '17', studentId: '2', subject: 'Chemistry', examType: 'class-test', marks: 79, totalMarks: 100, date: '2024-01-17', teacherId: 't5' },
  { id: '18', studentId: '2', subject: 'Chemistry', examType: 'unit-test', marks: 86, totalMarks: 100, date: '2024-02-13', teacherId: 't5' },
  { id: '19', studentId: '2', subject: 'Chemistry', examType: 'quarterly', marks: 92, totalMarks: 100, date: '2024-03-23', teacherId: 't5' },
  { id: '20', studentId: '2', subject: 'Chemistry', examType: 'half-yearly', marks: 89, totalMarks: 100, date: '2024-06-17', teacherId: 't5' },
];

export const examTypeLabels = {
  'class-test': 'Class Test',
  'unit-test': 'Unit Test',
  'quarterly': 'Quarterly',
  'half-yearly': 'Half-Yearly',
  'annual': 'Annual'
};