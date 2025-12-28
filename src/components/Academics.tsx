import React from 'react';
import { motion } from 'framer-motion';
import { FaMicroscope, FaFlask, FaCalculator, FaMoneyBillWave } from 'react-icons/fa';
import { FaComputer } from 'react-icons/fa6';

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

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Group 1 */}
          <motion.div
            className="bg-emerald-50 border border-emerald-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-gradient-to-br from-emerald-400 to-green-700 text-white">
                <FaFlask />
              </div>
              <h3 className="text-lg font-semibold text-green-800">Group 1</h3>
            </div>
            <ul className="mt-4 list-disc list-inside text-gray-700 space-y-1">
              <li>Tamil / French</li>
              <li>English</li>
              <li>Biology</li>
              <li>Maths</li>
              <li>Physics</li>
              <li>Chemistry</li>
            </ul>
          </motion.div>

          {/* Group 2 */}
          <motion.div
            className="bg-emerald-50 border border-emerald-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.02 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 text-white">
                <FaComputer />
              </div>
              <h3 className="text-lg font-semibold text-green-800">Group 2</h3>
            </div>
            <ul className="mt-4 list-disc list-inside text-gray-700 space-y-1">
              <li>Tamil / French</li>
              <li>English</li>
              <li>Computer Science</li>
              <li>Maths</li>
              <li>Physics</li>
              <li>Chemistry</li>
            </ul>
          </motion.div>

          {/* Group 3 */}
          <motion.div
            className="bg-emerald-50 border border-emerald-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.04 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
                <FaCalculator />
              </div>
              <h3 className="text-lg font-semibold text-green-800">Group 3</h3>
            </div>
            <ul className="mt-4 list-disc list-inside text-gray-700 space-y-1">
              <li>Tamil / French</li>
              <li>English</li>
              <li>Computer Application</li>
              <li>Accountancy</li>
              <li>Commerce</li>
              <li>Economics</li>
            </ul>
          </motion.div>

          {/* Group 4 */}
          <motion.div
            className="bg-emerald-50 border border-emerald-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.06 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white">
                <FaCalculator />
              </div>
              <h3 className="text-lg font-semibold text-green-800">Group 4</h3>
            </div>
            <ul className="mt-4 list-disc list-inside text-gray-700 space-y-1">
              <li>Tamil / French</li>
              <li>English</li>
              <li>Business Maths</li>
              <li>Accountancy</li>
              <li>Commerce</li>
              <li>Economics</li>
            </ul>
          </motion.div>
        </div>
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
