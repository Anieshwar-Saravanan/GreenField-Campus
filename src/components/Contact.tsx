import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';

const Contact: React.FC = () => (
  <div className="p-8 max-w-3xl mx-auto text-gray-800">
    <motion.h1
      className="text-4xl font-extrabold text-green-800 mb-8 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      Contact Us
    </motion.h1>
    <motion.p
      className="text-lg text-gray-700 text-center mb-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      We'd love to hear from you! Reach out for any queries, support, or admission assistance.
    </motion.p>

    <motion.div
      className="bg-green-50 p-6 rounded-lg shadow-md"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-green-700 font-semibold mb-2">📍 Address:</p>
      <p className="mb-4">Greenfield Campus, 123 Learning Road, YourCity, State - 600000</p>

      <p className="text-green-700 font-semibold mb-2">📞 Phone:</p>
      <p className="mb-4">+91-98765-43210</p>

      <p className="text-green-700 font-semibold mb-2">📧 Email:</p>
      <p>contact@greenfieldschool.edu.in</p>

          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-700 rounded-full p-2 hover:bg-emerald-100 transition"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-700 rounded-full p-2 hover:bg-emerald-100 transition"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://wa.me/919876543210" // Replace with actual WhatsApp number
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-700 rounded-full p-2 hover:bg-emerald-100 transition"
            >
              <FaWhatsapp size={20} />
            </a>
          </div>

          
    </motion.div>



  </div>
);

export default Contact;
