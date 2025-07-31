import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface AddStudentProps {
  parentId: string;
  onStudentAdded?: () => void;
}

const AddStudent: React.FC<AddStudentProps> = ({ parentId, onStudentAdded }) => {
  const [form, setForm] = useState({
    name: '',
    class: '',
    section: '',
    roll_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const { error } = await supabase.from('students').insert([
      {
        ...form,
        section: form.section.toUpperCase(),
        parent_id: parentId,
      },
    ]);

    setLoading(false);

    if (error) {
      setError(error.message || 'Failed to add student');
    } else {
      setSuccess(true);
      setForm({ name: '', class: '', section: '', roll_number: '' });
      if (onStudentAdded) onStudentAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="w-full px-4 py-2 border rounded" />
      <input name="class" value={form.class} onChange={handleChange} placeholder="Class" required className="w-full px-4 py-2 border rounded" />
      <input name="section" value={form.section} onChange={handleChange} placeholder="Section" required className="w-full px-4 py-2 border rounded" />
      <input name="roll_number" value={form.roll_number} onChange={handleChange} placeholder="Roll Number" required className="w-full px-4 py-2 border rounded" />
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">Student added!</div>}
      <button type="submit" disabled={loading} className="bg-emerald-500 text-white px-4 py-2 rounded w-full">{loading ? 'Adding...' : 'Add Student'}</button>
    </form>
  );
};

export default AddStudent;
