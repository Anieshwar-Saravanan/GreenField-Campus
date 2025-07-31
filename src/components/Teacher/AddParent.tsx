import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const AddParent: React.FC = () => {
  const [parentForm, setParentForm] = useState({
    name: '',
    email: '',
  });
  const [parentAddMsg, setParentAddMsg] = useState<string | null>(null);
  const [parentAddError, setParentAddError] = useState<string | null>(null);

  const handleParentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentForm({ ...parentForm, [e.target.name]: e.target.value });
  };

  const handleAddParent = async (e: React.FormEvent) => {
    e.preventDefault();
    setParentAddMsg(null);
    setParentAddError(null);
    const { error } = await supabase.from('users').insert([
      {
        name: parentForm.name,
        email: parentForm.email,
        role: 'parent',
        is_verified: false,
      },
    ]);
    if (error) {
      setParentAddError(error.message || 'Failed to add parent.');
      return;
    }
    setParentAddMsg('Parent added successfully!');
    setParentForm({ name: '', email: '' });
  };

  return (
    <div className="max-w-xl mx-auto mt-12">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
          <span className="text-emerald-600">👨‍👩‍👧‍👦</span>
          <span>Add Parent</span>
        </h1>
        <form onSubmit={handleAddParent} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
            <input
              type="text"
              name="name"
              value={parentForm.name}
              onChange={handleParentInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
            <input
              type="email"
              name="email"
              value={parentForm.email}
              onChange={handleParentInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold shadow"
          >
            Add Parent
          </button>
        </form>
        {parentAddMsg && <div className="text-green-700 mt-4">{parentAddMsg}</div>}
        {parentAddError && <div className="text-red-600 mt-4">{parentAddError}</div>}
      </div>
    </div>
  );
};

export default AddParent;
