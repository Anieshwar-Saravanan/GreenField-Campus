import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaInfoCircle, FaBookOpen, FaImages, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import schoolLogo from '/schoolLogo.jpeg';
const LandingNav: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State for hamburger menu

  const navLinks = [
    { label: 'About Us', to: '/about', icon: FaInfoCircle, color: 'text-lime-200' },
    { label: 'Academics', to: '/academics', icon: FaBookOpen, color: 'text-white' },
    { label: 'Gallery', to: '/gallery', icon: FaImages, color: 'text-white' },
    { label: 'Contact', to: '/contact', icon: FaEnvelope, color: 'text-white' },
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -20 }
  };

  const mobileLinkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <nav className="bg-gradient-to-r from-green-700 via-emerald-500 to-green-400 shadow-lg px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      {/* Logo and Brand */}
      <div className="flex items-center gap-4">
        <img src={schoolLogo} alt="School Logo" className="h-14 w-14 rounded-full bg-white p-1 shadow-md border-2 border-white" />
        <Link to="/" className="text-xl sm:text-3xl font-extrabold text-white drop-shadow-lg tracking-wide hover:text-lime-100 transition">Greenfield Campus</Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8 text-lg font-semibold">
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

      {/* Hamburger Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 w-full bg-green-600 bg-opacity-95 backdrop-blur-sm shadow-lg flex flex-col items-center p-4 md:hidden"
          >
            {navLinks.map((item) => (
              <motion.div variants={mobileLinkVariants} key={item.label} className="w-full">
                <Link
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-4 w-full py-3 text-white text-lg hover:bg-green-500 rounded-lg transition"
                >
                  <item.icon className={item.color} />
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <motion.div variants={mobileLinkVariants} className="w-full mt-4">
              <button
                className="w-full bg-white text-green-900 font-bold py-3 rounded-full shadow-lg hover:bg-lime-100 transition-all"
                onClick={() => {
                  navigate('/Login');
                  setIsOpen(false);
                }}
              >
                Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default LandingNav;
