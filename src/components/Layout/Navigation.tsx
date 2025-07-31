import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Home, BookOpen, Users, Settings, PlusCircle, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { path } from 'framer-motion/client';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  const getNavigationItems = () => {
    switch (user?.role) {
      case 'parent':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          { path: '/marks', label: 'View Marks', icon: BookOpen },
        ];
      case 'teacher':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          { path: '/enter-marks', label: 'Enter Marks', icon: PlusCircle },
          { path: '/students', label: 'My Students', icon: Users },
          {path: '/class-manager', label: 'Class Manager', icon: Settings },
          //{path: '/add-parent', label: 'Add Parent', icon: PlusCircle }, // Added Add Parent for teachers
        ];
      case 'admin':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          {path: '/teacher-performance', label: 'Teacher Performance', icon: Users },
          {path: '/student-performance', label: 'Student Performance', icon: BookOpen },  
          {path: '/admin-gallery', label: 'Admin Gallery', icon: PlusCircle }, 
          {path: '/teacher-signup', label: 'Teacher Sign Up', icon: PlusCircle },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-sm border-r border-gray-200 min-h-screen w-64">
      <div className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 no-underline ${
                    activePath === item.path
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        {/* Logout button for authenticated users */}
        {user && (
          <button
            onClick={async () => {
              await logout();
              navigate('/Login');
            }}
            className="mt-8 w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-800 font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        )}
        {/* General navigation always visible */}
        <div className="mt-8 border-t pt-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/about"
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 no-underline ${
                  activePath === '/about'
                    ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="font-medium">About Us</span>
              </Link>
            </li>
            <li>
              <Link
                to="/academics"
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 no-underline ${
                  activePath === '/academics'
                    ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="font-medium">Academics</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admission"
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 no-underline ${
                  activePath === '/admission'
                    ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="font-medium">Admission</span>
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 no-underline ${
                  activePath === '/gallery'
                    ? 'bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="font-medium">Gallery</span>
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 no-underline ${
                  activePath === '/contact'
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="font-medium">Contact</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;