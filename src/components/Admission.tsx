import React from 'react';
import { motion } from 'framer-motion';

const Admissions: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-800">
      <motion.h1
        className="text-4xl font-extrabold text-green-800 mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Admissions
      </motion.h1>

      <motion.section className="mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <h2 className="text-2xl font-bold text-green-700 mb-4">Enquiry Form</h2>
        <form className="space-y-4 bg-green-50 p-6 rounded-lg shadow">
          <input type="text" placeholder="Student Name" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
          <input type="text" placeholder="Parent Name" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
          <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
          <input type="tel" placeholder="Phone Number" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">Submit</button>
        </form>
      </motion.section>

      <motion.section className="mb-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-2xl font-bold text-green-700 mb-3">Prospectus</h2>
        <a
          href="/Greenfield_Prospectus.pdf"
          download
          className="text-green-600 underline hover:text-green-800 transition"
        >
          📄 Download PDF
        </a>
      </motion.section>

      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h2 className="text-2xl font-bold text-green-700 mb-3">Seat Intake</h2>
        <p className="text-gray-700">
          Limited seats available for Class IX to XII for the academic year <strong>2025–26</strong>.
        </p>
      </motion.section>
    </div>
  );
};

export default Admissions;
