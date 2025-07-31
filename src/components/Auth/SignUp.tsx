import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Phone, Lock, User, GraduationCap, ArrowLeft, CheckCircle } from 'lucide-react';

interface SignUpProps {
  onBackToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Hash password (in production, this should be done on the server)
      const passwordHash = btoa(formData.password); // Simple base64 encoding for demo

      const { data, error: signUpError } = await supabase
        .from('users')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.toLowerCase().trim(),
            phone: formData.phone.trim() || null,
            password_hash: passwordHash,
            role: 'parent',
            is_verified: false,
          },
        ])
        .select()
        .single();

      if (signUpError) {
        if (signUpError.code === '23505') {
          if (signUpError.message.includes('email')) {
            setError('An account with this email already exists');
          } else if (signUpError.message.includes('phone')) {
            setError('An account with this phone number already exists');
          } else {
            setError('An account with these details already exists');
          }
        } else {
          setError('Failed to create account. Please try again.');
        }
        return;
      }

      setSuccess(true);
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        onBackToLogin();
      }, 3000);

    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Account Created Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Your account has been created and is pending verification. You can now log in to access the portal.
            </p>
            <button
              onClick={onBackToLogin}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-green-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all font-medium"
            >
              Continue to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
              Greenfield Campus
            </h1>
            <p className="text-gray-600 mt-2">Create Your Account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>



            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-green-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onBackToLogin}
              className="flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;