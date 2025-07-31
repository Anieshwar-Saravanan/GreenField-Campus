export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'parent' | 'teacher' | 'admin';
}

export interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  parentId: string;
}

export interface Mark {
  id: string;
  studentId: string;
  subject: string;
  examType: 'class-test' | 'unit-test' | 'quarterly' | 'half-yearly' | 'annual';
  marks: number;
  totalMarks: number;
  date: string;
  teacherId: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}