import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithOTP: (email: string, otp: string) => Promise<void>;
  loginWithOtp?: (user: User) => void;
  sendOTP: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setAuthState({
        user: JSON.parse(savedUser),
        isAuthenticated: true,
        loading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);
  // Add loginWithOtp for email OTP login
  const loginWithOtp = (userObj: User) => {
    setAuthState({
      user: userObj,
      isAuthenticated: true,
      loading: false,
    });
    localStorage.setItem('user', JSON.stringify(userObj));
  };

  const login = async (email: string, password: string) => {
    try {
      // First check demo accounts for backward compatibility
      if (email === 'parent@test.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          name: 'John Smith',
          email,
          phone: '+1234567890',
          role: 'parent',
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setAuthState({
          user: mockUser,
          isAuthenticated: true,
          loading: false,
        });
        return;
      }

      if (email === 'teacher@test.com' && password === 'password') {
        const mockUser: User = {
          id: 't1',
          name: 'Sarah Johnson',
          email,
          phone: '+1234567891',
          role: 'teacher',
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setAuthState({
          user: mockUser,
          isAuthenticated: true,
          loading: false,
        });
        return;
      }

      if (email === 'admin@test.com' && password === 'password') {
        const mockUser: User = {
          id: 'a1',
          name: 'Admin User',
          email,
          phone: '+1234567892',
          role: 'admin',
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setAuthState({
          user: mockUser,
          isAuthenticated: true,
          loading: false,
        });
        return;
      }

      // Check database for real users
      const passwordHash = btoa(password); // Simple base64 encoding for demo
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .eq('password_hash', passwordHash)
        .single();

      if (error || !data) {
        throw new Error('Invalid email or password');
      }

      const user: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        role: data.role,
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const loginWithOTP = async (email: string, otp: string) => {
    // Use Supabase's built-in OTP verification for email
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });
    if (error || !data || !data.user) {
      throw new Error(error?.message || 'OTP verification failed');
    }
    // Fetch user profile from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .single();
    if (userError || !userData) {
      throw new Error('User profile not found');
    }
    const user: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role,
    };
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({
      user,
      isAuthenticated: true,
      loading: false,
    });
  };

  const sendOTP = async (email: string) => {
    // Use Supabase's built-in OTP sending for email
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      throw new Error(error.message || 'Failed to send OTP');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        loginWithOTP,
        loginWithOtp,
        logout,
        sendOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};