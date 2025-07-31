import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import LandingNav from './components/Layout/LandingNav';
import ParentDashboard from './components/Parent/ParentDashboard';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import MyStudents from './components/Teacher/MyStudents';
import EnterMarks from './components/Teacher/EnterMarks';
import AdminDashboard from './components/Admin/AdminDashboard';
import Login from './components/Auth/Login';
import AboutUs from './components/AboutUs';
import Academics from './components/Academics';
import Admission from './components/Admission';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import StudentLife from './components/StudentLife';
import Footer from './components/Layout/Footer';
import TeacherPerformance from './components/Admin/TeacherPerformance';
import StudentPerformance from './components/Admin/StudentPerformance';
import ClassManager from './components/Teacher/ClassManager';
import Achievements from './components/achivements';
import AddParent from './components/Teacher/AddParent';
import AdminGallery from './components/Admin/AdminGallery';
import TeacherSignUp from './components/Admin/TeacherSignUp';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showLogin) {
      // Show login form
      return <Login />;
    }
    // Show landing page for unauthenticated users with its own navbar
    return (
      <div className="min-h-screen bg-gray-50">

          <LandingNav />
          <Routes>
            <Route path="/about" element={<AboutUs />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="Login" element={<Login />} />
            <Route path="/student-life" element={<StudentLife />} />
            <Route path="/achievements" element={<Achievements />} />
            {/* Login route */}
            <Route path="/" element={<LandingPage onLoginClick={() => setShowLogin(true)} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Navigation />
        <main className="flex-1 p-6">
          <Routes>
            {/* General pages */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/student-life" element={<StudentLife />} />
            {/* Login route */}
            <Route path="Login" element={<Login />} />
            <Route path="/" element={<LandingPage onLoginClick={() => setShowLogin(true)} />} />
            {/* Parent routes */}
            {user?.role === 'parent' && <>
              <Route path="/dashboard" element={<ParentDashboard activeTab="dashboard" />} />
              <Route path="/marks" element={<ParentDashboard activeTab="view-marks" />} />
            </>}
            {/* Teacher routes */}
            {user?.role === 'teacher' && <>
              <Route path="/dashboard" element={<TeacherDashboard />} />
              <Route path="/enter-marks" element={<EnterMarks />} />
              {user && <Route path="/students" element={<MyStudents teacherId={user.id} />} />}
              <Route path="/class-manager" element={<ClassManager />} />
              <Route path="/add-parent" element={<AddParent />} />
            </>}
            {/* Admin routes */}
            {user?.role === 'admin' && <>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/teacher-performance" element={<TeacherPerformance />} />
              <Route path="/student-performance" element={<StudentPerformance />} />
              <Route path="/admin-gallery" element={<AdminGallery />} />
              <Route path="/teacher-signup" element={<TeacherSignUp />} />
            </>}
            {/* Default route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Footer />  
      </Router>
    </AuthProvider>
  );
}

export default App;