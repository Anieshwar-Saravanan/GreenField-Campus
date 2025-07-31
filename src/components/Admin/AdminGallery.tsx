import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const AdminGallery: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setError(null);
    setSuccess(null);
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, selectedFile);
    if (uploadError) {
      setError('Upload failed: ' + uploadError.message);
    } else {
      setSuccess('Photo uploaded successfully!');
      setSelectedFile(null);
    }
    setUploading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Photo to Gallery</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Photo'}
      </button>
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {success && <div className="mt-4 text-green-600">{success}</div>}
    </div>
  );
};

export default AdminGallery;
