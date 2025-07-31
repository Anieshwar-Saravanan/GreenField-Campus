import React from 'react';
import { motion } from 'framer-motion';

const StudentLife: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-800">
      <motion.h1
        className="text-4xl font-extrabold text-green-800 mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Student Life
      </motion.h1>

      <motion.section className="mb-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <h2 className="text-2xl font-bold text-green-700 mb-4">Events & Celebrations</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Annual Day</li>
          <li>Sports Day</li>
          <li>Club Events</li>
          <li>State & National Competitions</li>
        </ul>
      </motion.section>

      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-2xl font-bold text-green-700 mb-4">Photo Memories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['/gallery.jpg', '/achievement.webp', '/admission.webp', '/school-image.jpg'].map((img, i) => (
            <motion.img
              key={i}
              src={img}
              alt={`Memory ${i}`}
              className="rounded shadow-md hover:shadow-xl transition"
              whileHover={{ scale: 1.03 }}
            />
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default StudentLife;
