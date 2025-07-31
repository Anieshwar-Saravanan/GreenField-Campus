import React from 'react';
import { motion } from 'framer-motion';

const FacilityCard: React.FC<{ icon: string; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-xl transition"
    whileHover={{ scale: 1.05 }}
  >
    <img src={icon} alt={title} className="h-20 mb-4" />
    <h3 className="font-semibold text-lg mb-2 text-green-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const Facilities: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-800">
      <motion.h1
        className="text-4xl font-extrabold text-green-800 mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Our Facilities
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FacilityCard icon="/icons/lab.svg" title="Labs" description="Physics, Chemistry, Biology, and Computer Labs" />
        <FacilityCard icon="/icons/smartclass.svg" title="Smart Classrooms" description="Interactive digital boards in every class" />
        <FacilityCard icon="/icons/library.svg" title="Library" description="Thousands of books, journals & study materials" />
        <FacilityCard icon="/icons/sports.svg" title="Physical Education" description="Well-maintained courts and sports equipment" />
        <FacilityCard icon="/icons/bus.svg" title="Transport" description="Safe and punctual school bus services" />
      </div>
    </div>
  );
};

export default Facilities;
