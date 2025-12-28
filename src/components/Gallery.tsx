import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const Gallery: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'photo'>('all');
  const [media, setMedia] = useState<{ type: 'photo'; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
    // Recursively list all files in the gallery bucket
    const listAllFiles = async (): Promise<any[]> => {
      // List files in root
      const { data: rootData, error: rootError } = await supabase.storage.from('gallery').list('', { limit: 100 });
      // List files in 'gallery' subfolder
      const { data: subData, error: subError } = await supabase.storage.from('gallery').list('gallery', { limit: 100 });
      // Debug: log raw responses
      // eslint-disable-next-line no-console
      console.log('Supabase rootData:', rootData);
      // eslint-disable-next-line no-console
      console.log('Supabase subData:', subData);
      let files: any[] = [];
      if (rootData) {
        files = files.concat(rootData.map((item: any) => ({ ...item, fullPath: item.name })));
      }
      if (subData) {
        files = files.concat(subData.map((item: any) => ({ ...item, fullPath: `gallery/${item.name}` })));
      }
      // eslint-disable-next-line no-console
      console.log('Supabase all files after merge:', files);
      return files;
    };

    const fetchGallery = async () => {
      setLoading(true);
      setError(null);
      try {
        const files = await listAllFiles();
        // Debug: log all file paths found
        // eslint-disable-next-line no-console
        console.log('Supabase gallery files:', files.map((f: any) => f.fullPath));
        const imageFiles = files.filter((file: any) => {
          const ext = file.fullPath.split('.').pop().toLowerCase();
          return imageExts.includes(ext);
        });
        // Debug: log all image file paths found
        // eslint-disable-next-line no-console
        console.log('Supabase gallery image files:', imageFiles.map((f: any) => f.fullPath));
        const mediaArr = imageFiles.map((file: any) => ({
          type: 'photo' as 'photo',
          url: supabase.storage.from('gallery').getPublicUrl(file.fullPath).data.publicUrl
        }));
        // Debug: log all public URLs generated
        // eslint-disable-next-line no-console
        console.log('Supabase gallery public URLs:', mediaArr.map((m: any) => m.url));
        setMedia(mediaArr);
      } catch (e: any) {
        setError('Failed to load gallery.');
      }
      setLoading(false);
    };
    fetchGallery();
  }, []);

  const filteredMedia = filter === 'all' ? media : media.filter(m => m.type === filter);

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-800">
      <motion.h1
        className="text-4xl font-extrabold text-green-800 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Gallery
      </motion.h1>

      <div className="flex justify-center gap-4 mb-8">
        {['all', 'photo'].map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-full capitalize ${
              filter === type ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setFilter(type as 'all' | 'photo')}
          >
            {type}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading gallery...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {filteredMedia.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">No photos found.</div>
          ) : (
            filteredMedia.map((m, i) => (
              <motion.div key={i} className="rounded overflow-hidden shadow-lg" whileHover={{ scale: 1.02 }}>
                <img
                  src={m.url}
                  alt="Gallery"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;
