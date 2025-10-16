import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Backend URL - use Vite env var or fallback to localhost
const BACKEND_BASE = (import.meta as any).env.VITE_BACKEND_URL || 'http://localhost:4000';

const Admissions: React.FC = () => {
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${BACKEND_BASE}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, parentName, email, phone, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to send enquiry');
      setSuccess('Enquiry sent successfully! We will contact you soon.');
      setStudentName('');
      setParentName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to send enquiry');
    } finally {
      setLoading(false);
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-4 bg-green-50 p-6 rounded-lg shadow">
          <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" required />
          <input type="text" placeholder="Parent Name" value={parentName} onChange={(e) => setParentName(e.target.value)} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" required />
          <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
          <textarea placeholder="Additional Message (optional)" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" rows={3} />
          {success && <div className="text-green-700 font-medium">{success}</div>}
          {error && <div className="text-red-600 font-medium">{error}</div>}
          <button type="submit" disabled={loading} className="bg-green-600 disabled:opacity-60 text-white px-6 py-2 rounded hover:bg-green-700 transition">
            {loading ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </motion.section>

      {/* <motion.section className="mb-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-2xl font-bold text-green-700 mb-3">Prospectus</h2>
        <a
          href="/Greenfield_Prospectus.pdf"
          download
          className="text-green-600 underline hover:text-green-800 transition"
        >
          📄 Download PDF
        </a>
      </motion.section> */}

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
