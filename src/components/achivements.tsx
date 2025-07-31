import React from 'react';
import { motion } from 'framer-motion';

const achievementData = [
  {
    title: '100% Board Exam Pass Rate',
    year: '2020–2024',
    description: 'Our students have maintained a consistent 100% pass rate in board exams for the last 4 years.',
    image: '/achievements-2.png',
  },
  {
    title: 'State-Level Science Olympiad Winners',
    year: '2023',
    description: 'Greenfield students secured the top 3 positions in the TN State Science Olympiad.',
    image: '/achievements-1.jpg',
  },
  {
    title: 'National Yoga Championship Gold',
    year: '2022',
    description: 'Our senior students won gold at the National Yoga Meet in Delhi.',
    image: '/achievements-3.jpg',
  },
];

const Achievements: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <motion.h1 
        className="text-4xl font-bold mb-4 text-green-800 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Our Achievements
      </motion.h1>

      <motion.p 
        className="text-lg text-gray-700 text-center mb-10"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        We take pride in our students' academic and co-curricular accomplishments.
      </motion.p>

      {/* Achievement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {achievementData.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-xl font-bold text-green-700 mb-1">{item.title}</h3>
              <span className="text-sm text-gray-500">{item.year}</span>
              <p className="text-gray-600 mt-2">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Quote */}
      <div className="mt-12 text-center">
        <motion.blockquote 
          className="italic text-green-700 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          "Excellence is not a skill, it’s an attitude – and our students prove it every year."
        </motion.blockquote>
      </div>
    </div>
  );
};

export default Achievements;
