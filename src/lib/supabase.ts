import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          password_hash: string;
          name: string;
          role: 'parent' | 'teacher' | 'admin';
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          phone?: string | null;
          password_hash: string;
          name: string;
          role?: 'parent' | 'teacher' | 'admin';
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          phone?: string | null;
          password_hash?: string;
          name?: string;
          role?: 'parent' | 'teacher' | 'admin';
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          name: string;
          class: string;
          section: string;
          roll_number: string;
          parent_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          class: string;
          section: string;
          roll_number: string;
          parent_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          class?: string;
          section?: string;
          roll_number?: string;
          parent_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      marks: {
        Row: {
          id: string;
          student_id: string;
          subject: string;
          exam_type: 'class-test' | 'unit-test' | 'quarterly' | 'half-yearly' | 'annual';
          marks: number;
          total_marks: number;
          date: string;
          teacher_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          subject: string;
          exam_type: 'class-test' | 'unit-test' | 'quarterly' | 'half-yearly' | 'annual';
          marks: number;
          total_marks: number;
          date: string;
          teacher_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          subject?: string;
          exam_type?: 'class-test' | 'unit-test' | 'quarterly' | 'half-yearly' | 'annual';
          marks?: number;
          total_marks?: number;
          date?: string;
          teacher_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}