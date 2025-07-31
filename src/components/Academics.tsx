import React from 'react';
import { motion } from 'framer-motion';

const Academics: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto bg-white shadow-md rounded-lg my-10">
      <motion.h1 className="text-4xl font-bold text-green-800 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Academics
      </motion.h1>

      <motion.section className="mb-10" whileInView={{ y: 0, opacity: 1 }} initial={{ y: 20, opacity: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-semibold text-green-700">📘 Curriculum</h2>
        <p className="text-gray-700 mt-2 text-lg">
          We follow Samacheer Kalvi for Class IX and State Board for Classes XI & XII. English is the medium of instruction.
        </p>
      </motion.section>

      <motion.section className="mb-10" whileInView={{ y: 0, opacity: 1 }} initial={{ y: 20, opacity: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <h2 className="text-2xl font-semibold text-green-700">📚 XII Standard Groups</h2>
        <ul className="list-disc list-inside text-gray-700 mt-2 text-lg space-y-1">
          <li>Biology with Maths</li>
          <li>Computer Science with Physics</li>
          <li>Commerce with Accountancy</li>
          <li>Vocational Courses</li>
        </ul>
      </motion.section>

      <motion.section whileInView={{ y: 0, opacity: 1 }} initial={{ y: 20, opacity: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
        <h2 className="text-2xl font-semibold text-green-700">🧑‍🏫 Teaching Methodology</h2>
        <p className="text-gray-700 mt-2 text-lg">
          Interactive, value-based learning enhanced with smart boards and activity-based engagement.
        </p>
      </motion.section>
    </div>
  );
};

export default Academics;
