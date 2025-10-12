import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTrophy, FaImages, FaUserGraduate, FaBullhorn, FaMapMarkerAlt } from 'react-icons/fa';

// Import images directly so Vite can process them
import achievementImage from '/achievement.webp';
import galleryImage from '/gallery.jpg';
import admissionImage from '/admission.webp';
import schoolImage from '/school-image.jpg';
import schoolEntrance from '/school entrance.jpeg';
import schoolEntrance1 from '/school entrance1.jpeg';
import school from '/school slide.jpeg'
const testimonials = [
  {
    name: 'Mohammed Sadiq',
    role: 'Parent',
    review: 'GreenField School has transformed my child’s learning experience. The teachers are caring and the campus is vibrant!',
  },
  {
    name: 'Priya S',
    role: 'Student',
    review: 'I love the activities and the friendly environment. I feel encouraged to do my best every day!',
  },
  {
    name: 'Mukunthan S',
    role: 'Teacher',
    review: 'Teaching at GreenField is a joy. The staff and students make every day rewarding.',
  },
];

interface LandingPageProps {
  onLoginClick: () => void;
}

const highlightCards = [
  {
    title: 'Achievements',
    description: "Celebrating our students' and school's proud moments.",
    image: achievementImage,
    link: './achievements',
    icon: FaTrophy,
    color: 'text-yellow-500',
  },
  {
    title: 'Gallery',
    description: 'Snapshots from events, activities, and daily school life.',
    image: galleryImage,
    link: './gallery',
    icon: FaImages,
    color: 'text-purple-500',
  },
  {
    title: 'Admission Open',
    description: 'Join our vibrant community. Apply for 2025-26 now!',
    image: admissionImage,
    link: './admission',
    icon: FaUserGraduate,
    color: 'text-green-600',
  },
];
const LandingPage: React.FC<LandingPageProps> = () => {
  const [current, setCurrent] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  // Touch state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const autoSlideRef = React.useRef<NodeJS.Timeout | null>(null);

  // Background slideshow images (order: school + 3 others)
  const bgImages = [school,schoolEntrance,schoolEntrance1];

  // Background auto-rotate every 5s
  React.useEffect(() => {
    const id = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Auto-slide logic
  React.useEffect(() => {
    autoSlideRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 3500);
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, []);

  // Swipe handler
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
    if (autoSlideRef.current) clearInterval(autoSlideRef.current); // Pause auto-slide on touch
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const distance = touchStartX - touchEndX;
      if (distance > 50) {
        // Swipe left (next)
        setCurrent((prev) => (prev + 1) % testimonials.length);
      } else if (distance < -50) {
        // Swipe right (prev)
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      }
    }
    // Resume auto-slide
    autoSlideRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 3500);
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col w-full">
      {/* Header */}

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center min-h-[800px] md:min-h-[900px] w-full">
        {/* Background image layers (crossfade) */}
        {bgImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${idx === bgIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${img})`, zIndex: 0 }}
            aria-hidden
          />
        ))}

        {/* Colored overlay above backgrounds */}
        <div className="absolute inset-0 bg-green-900 bg-opacity-40" style={{ zIndex: 10 }}></div>

        <div className="relative z-20 py-32">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-4">GreenField Campus( V.C.S.M Matric. Higher Secondary School)
</h1>
          {/* <p className="text-2xl md:text-3xl text-white font-light mb-8 drop-shadow">Glory &amp; Greatness</p> */}
          <motion.p
            className="text-2xl md:text-3xl text-white font-light mb-8 drop-shadow"
            initial={{ scale: 1, opacity: 0.7, color: "#fff" }}
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.7, 1, 0.7],
              color: ["#fff", "#a7f3d0", "#fff"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            Education , Empower &amp; Excel
          </motion.p>
        </div>
      </section>

      {/* Highlights Section */}
      {/* Testimonials Carousel */}
      <section className="bg-white py-12 w-full">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="text-2xl font-bold text-emerald-700 mb-6">Testimonials</h2>
          <div
            className="relative w-full flex items-center justify-center"
            style={{ minHeight: 320 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Previous testimonial (partially visible, no photo) */}
            <div className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 w-1/3 pointer-events-none opacity-60">
              <motion.div
                key={current === 0 ? testimonials.length - 1 : current - 1}
                initial={{ scale: 0.95, x: -40, opacity: 0.5 }}
                animate={{ scale: 1, x: 0, opacity: 0.7 }}
                transition={{ duration: 0.5 }}
                className="bg-green-100 rounded-xl shadow p-4 flex flex-col items-center text-center scale-90"
              >
                <p className="text-sm italic text-gray-500 mb-2 truncate">"{testimonials[(current - 1 + testimonials.length) % testimonials.length].review}"</p>
                <div className="font-semibold text-emerald-500">{testimonials[(current - 1 + testimonials.length) % testimonials.length].name}</div>
              </motion.div>
            </div>
            {/* Main testimonial (no photo, auto-slide, swipeable) */}
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-green-50 rounded-xl shadow-lg p-8 flex flex-col items-center text-center z-10"
              style={{ width: '100%', maxWidth: 400 }}
            >
              <p className="text-lg italic text-gray-700 mb-4">"{testimonials[current].review}"</p>
              <div className="font-bold text-emerald-700">{testimonials[current].name}</div>
              <div className="text-sm text-gray-500">{testimonials[current].role}</div>
            </motion.div>
            {/* Next testimonial (partially visible, no photo) */}
            <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 w-1/3 pointer-events-none opacity-60">
              <motion.div
                key={current === testimonials.length - 1 ? 0 : current + 1}
                initial={{ scale: 0.95, x: 40, opacity: 0.5 }}
                animate={{ scale: 1, x: 0, opacity: 0.7 }}
                transition={{ duration: 0.5 }}
                className="bg-green-100 rounded-xl shadow p-4 flex flex-col items-center text-center scale-90"
              >
                <p className="text-sm italic text-gray-500 mb-2 truncate">"{testimonials[(current + 1) % testimonials.length].review}"</p>
                <div className="font-semibold text-emerald-500">{testimonials[(current + 1) % testimonials.length].name}</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-green-50 py-12 w-full">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        {highlightCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link to={card.link} key={card.title}>
              <motion.div
                className="bg-white rounded-lg shadow p-6 flex flex-col items-center min-h-[400px] md:min-h-[450px] cursor-pointer hover:scale-105 hover:shadow-xl transition-transform"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18, delay: idx * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9, rotate: -10 }}
                  animate={{ y: [0, -15, 0], transition: { repeat: Infinity, duration: 2 } }}
                  className={card.color}
                >
                  <Icon size={48} />
                </motion.div>
                <img src={card.image} alt={card.title} className="h-64 w-full object-cover rounded mb-4" />
                <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                <p className="text-gray-600 text-center">{card.description}</p>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>

      


      {/* Google Maps Section */}
      <section className="bg-white py-8 w-full">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">Find Us</h2>
          <div className="rounded-lg overflow-hidden shadow-lg border border-green-200">
            <iframe
              title="Green Field campus"
              src="https://www.google.com/maps?q=Green+Field+Matriculation+School+Coimbatore&output=embed"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
};

export default LandingPage;
