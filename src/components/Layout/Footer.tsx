import React from 'react';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';

const Footer: React.FC = () => (
  <footer className="bg-gradient-to-r from-green-700 via-emerald-500 to-green-400 text-white py-6 mt-auto w-full">
    <div className="w-full max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
      
      {/* Contact Info */}
      <div className="text-center md:text-left">
        <div className="font-bold text-lg">Greenfield Campus</div>
        <div>11/34B, Udayampalayam Rd, <br />Gounder Mills,
       <br />Coimbatore, Tamil Nadu 641029.
</div>
        <div>+91 96003 66634 | 
9894376100</div>
        <div>campusgreenfield@gmail.com</div>
      </div>

      {/* Social Media Buttons */}
      <div className="flex gap-4">
        <a
          href="https://www.instagram.com/greenfieldcampus?igsh=dzJ6ZjVrcXEzdXE0"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-green-700 rounded-full p-2 hover:bg-emerald-100 transition"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href="https://www.facebook.com/share/1Lw4p5eRgs/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-green-700 rounded-full p-2 hover:bg-emerald-100 transition"
        >
          <FaFacebookF size={20} />
        </a>
        <a
          href="https://wa.me/919894376100" // Replace with actual WhatsApp number
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-green-700 rounded-full p-2 hover:bg-emerald-100 transition"
        >
          <FaWhatsapp size={20} />
        </a>
      </div>

      {/* Copyright */}
      <div className="text-sm text-center md:text-right">
        &copy; {new Date().getFullYear()} GreenField School. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
