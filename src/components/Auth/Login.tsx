import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Phone, Lock, Send, GraduationCap, UserPlus } from 'lucide-react';
import SignUp from './SignUp';
import { useNavigate } from 'react-router-dom';
import { signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../firebase';
import { RecaptchaVerifier } from 'firebase/auth';


declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}



const Login: React.FC = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp' | 'phone'>('otp');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // phone otp vars
  const [phone, setPhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [otpConfirm, setOtpConfirm] = useState<any>(null);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);

  const navigate = useNavigate();
  const { login} = useAuth();
  const { loginWithOtp } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Check if email exists in users table
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
      if (error || !data) throw new Error('Email not registered. Please sign up first.');

      // Call backend to send OTP via Nodemailer
      const response = await fetch('http://localhost:4000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to send OTP.');
      setOtpSent(true);
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Call backend to verify OTP
      const response = await fetch('http://localhost:4000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Invalid OTP.');

      // Fetch user role from Supabase
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, phone, role')
        .eq('email', email)
        .single();
      if (error || !data) {
        navigate('/dashboard'); // fallback
        return;
      }
      // Set user and isAuthenticated in context (OTP flow)
      if (typeof loginWithOtp === 'function') {
        loginWithOtp({
          id: data.id,
          name: data.name || '',
          email: data.email,
          phone: data.phone || '',
          role: data.role,
        });
      }
      // Redirect based on role (keep existing route logic)
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA solved");
        },
      },
    );

    window.recaptchaVerifier.render().catch(console.error);
  }
};

const handlePhoneSendOtp = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    // Always add +91 country code for Firebase, strip non-digits from input
    const rawPhone = phone.replace(/\D/g, '');
    if (rawPhone.length !== 10) {
      setError('Please enter a valid 10-digit phone number.');
      setLoading(false);
      return;
    }
    const phoneWithCountryCode = `+91${rawPhone}`;
    const confirmation = await signInWithPhoneNumber(auth, phoneWithCountryCode, appVerifier);
    setOtpConfirm(confirmation);
    setPhoneOtpSent(true);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const handlePhoneVerifyOtp = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  try {
    const result = await otpConfirm.confirm(phoneOtp);
    const phoneUser = result.user;

    // Fetch user from Supabase by phone number
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    // Remove all non-digit chars for comparison
    const normalizedPhone = phone.replace(/\D/g, ''); // user input, 10 digits
    // Query all users with a phone number
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, phone, role');
    if (error || !users || users.length === 0) throw new Error('Phone number not registered. Please sign up first.');
    // Find user with matching phone (normalize both sides, compare last 10 digits)
    const user = users.find((u: any) => {
      const dbPhone = String(u.phone || '').replace(/\D/g, '');
      return dbPhone.slice(-10) === normalizedPhone;
    });
    if (!user) throw new Error('Phone number not registered. Please sign up first.');

    // Set user and isAuthenticated in context (OTP flow)
    if (typeof loginWithOtp === 'function') {
      loginWithOtp({
        id: user.id,
        name: user.name || '',
        email: user.email,
        phone: user.phone || '',
        role: user.role,
      });
    }

    // Redirect based on role
    if (user.role === 'admin') {
      navigate('/dashboard');
    } else if (user.role === 'teacher') {
      navigate('/dashboard');
    } else if (user.role === 'parent') {
      navigate('/dashboard');
    } else {
      navigate('/dashboard'); // fallback
    }
  } catch (err: any) {
    setError(err.message || 'Invalid OTP');
  } finally {
    setLoading(false);
  }
};


  if (showSignUp) {
    return <SignUp onBackToLogin={() => setShowSignUp(false)} />;
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
            <p className="text-gray-600 mt-2">Parent Portal Login</p>
          </div>

          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setLoginMethod('otp')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
                loginMethod === 'otp'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Mail className="h-4 w-4" />
              <span>Email OTP</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
                loginMethod === 'phone'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Phone className="h-4 w-4" />
              <span>Phone OTP</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* {loginMethod === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-green-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )} */}

          {loginMethod === 'otp' && (
            <>
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{loading ? 'Sending OTP...' : 'Send OTP'}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOTPLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center text-lg tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-green-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
                  >
                    Back to Email
                  </button>
                </form>
              )}
            </>
          )}

          {loginMethod === 'phone' && (
            <>
              {!phoneOtpSent ? (
                <form onSubmit={handlePhoneSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="+1 234 567 8901"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{loading ? 'Sending OTP...' : 'Send OTP'}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePhoneVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                    <input
                      type="text"
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center text-lg tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-green-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPhoneOtpSent(false); setPhoneOtp(''); setError(''); }}
                    className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
                  >
                    Back to Phone
                  </button>
                </form>
              )}
            </>
          )}

          {/* <div className="mt-6 text-center">
            <button
              onClick={() => setShowSignUp(true)}
              className="flex items-center justify-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors mx-auto font-medium"
            >
              <UserPlus className="h-4 w-4" />
              <span>Create New Account</span>
            </button>
          </div> */}
        </div>
      </div>
      <div id="recaptcha-container"></div>

    </div>
  );
};

export default Login;