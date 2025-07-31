import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaInfoCircle, FaBookOpen, FaUserGraduate, FaImages, FaEnvelope, FaUserFriends } from 'react-icons/fa';
import { motion } from 'framer-motion';


const LandingNav: React.FC = () => {
  const navigate = useNavigate();
  const navLinks = [
    { label: 'About Us', to: '/about', icon: FaInfoCircle, color: 'text-lime-200' },
    { label: 'Academics', to: '/academics', icon: FaBookOpen, color: 'text-white' },
    { label: 'Admission', to: '/admission', icon: FaUserGraduate, color: 'text-white' },
    { label: 'Gallery', to: '/gallery', icon: FaImages, color: 'text-white' },
    { label: 'Contact', to: '/contact', icon: FaEnvelope, color: 'text-white' },
    { label: 'Student Life', to: '/student-life', icon: FaUserFriends, color: 'text-white' },
  ];
  return (
    <nav className="bg-gradient-to-r from-green-700 via-emerald-500 to-green-400 shadow-lg px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <img src="/school-logo.jpeg" alt="School Logo" className="h-14 w-14 rounded-full bg-white p-1 shadow-md border-2 border-white" />
        <Link to="/" className="text-3xl font-extrabold text-white drop-shadow-lg tracking-wide hover:text-lime-100 transition">Greenfield Campus</Link>
      </div>
      <div className="flex items-center gap-8 text-lg font-semibold">
        {navLinks.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link to={item.to} key={item.label} className="flex flex-col items-center group hover:text-lime-200 transition">
              <motion.div
                whileHover={{ scale: 1.3, rotate: 10, y: -5 }}
                whileTap={{ scale: 0.9, rotate: -10 }}
                animate={{ y: [0, -8, 0], transition: { repeat: Infinity, duration: 2, delay: idx * 0.2 } }}
                className={item.color + " mb-1"}
              >
                <Icon size={22} />
              </motion.div>
              <span className="text-xs font-semibold text-white group-hover:text-lime-100 transition">{item.label}</span>
            </Link>
          );
        })}
        <button
          className="ml-6 bg-white text-green-900 font-bold px-7 py-2 rounded-full shadow-lg border border-green-200 hover:bg-lime-100 hover:scale-105 transition-all duration-200"
          onClick={() => navigate('/Login')}
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default LandingNav;
