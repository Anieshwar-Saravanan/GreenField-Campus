import React from 'react';
import { motion } from 'framer-motion';
import {
  FaMedal,
  FaTrophy,
  FaFutbol,
  FaHockeyPuck,
  FaLeaf,
  FaTheaterMasks,
  FaMicrophone,
  FaBook,
  FaLaptopCode,
  FaAward,
} from 'react-icons/fa';

// Structured achievements with categories and icons for a more appealing UI.
const achievements = [
  {
    title: 'State-Level Silambam Champion',
    description:
      'Proud moment as our student shines at the state level in traditional Silambam!',
    category: 'Sports',
    icon: FaMedal,
  },
  {
    title: '100% Board Exam Results',
    description:
      'Excellence achieved — every student passed with flying colours consistently every year.',
    category: 'Academics',
    icon: FaBook,
  },
  {
    title: 'District-Level Hockey Winners',
    description: 'Green Fields hockey team triumphs with skill, teamwork, and spirit.',
    category: 'Sports',
    icon: FaHockeyPuck,
  },
  {
    title: 'District-Level Football Champions',
    description: 'Victory on the field — our football team brings home district glory!',
    category: 'Sports',
    icon: FaFutbol,
  },
  {
    title: 'Participation in CM Trophy',
    description: 'Proud participants in the Chief Minister’s Trophy — gaining experience and inspiration!',
    category: 'Sports',
    icon: FaTrophy,
  },
  {
    title: 'Inter-School Cultural Fest Winners',
    description: 'Creativity at its best! Our students stole the spotlight with their talent and teamwork!',
    category: 'Cultural',
    icon: FaTheaterMasks,
  },
  {
    title: 'District-Level Singing Champions',
    description: 'Melodies that mesmerized — congratulations to our young voices of Green Fields!',
    category: 'Cultural',
    icon: FaMicrophone,
  },
  {
    title: 'Top Scorers in State-Level Quiz Competition',
    description: 'Knowledge meets confidence! Our quiz team proved that learning truly pays off!',
    category: 'Academics',
    icon: FaAward,
  },
  {
    title: 'Zonal-Level Badminton Winners',
    description: 'Smash! Set! Win! Our badminton team displayed agility and determination on the court!',
    category: 'Sports',
    icon: FaMedal,
  },
  {
    title: 'Best School Performance Award',
    description: 'Proud moment as Green Fields is recognized for outstanding overall performance in academics and co-curriculars!',
    category: 'Recognition',
    icon: FaAward,
  },
  {
    title: 'Eco Club – Green School Award',
    description: 'Sustainability in action! Honoured for promoting eco-friendly initiatives on campus!',
    category: 'Eco',
    icon: FaLeaf,
  },
  {
    title: 'Inter-School Coding Competition Winners',
    description: 'Innovation meets intelligence — our tech wizards clinched the coding crown!',
    category: 'Tech',
    icon: FaLaptopCode,
  },
];

const Achievements: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <motion.h1 
        className="text-4xl font-bold mb-4 text-green-800 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Our Achievements
      </motion.h1>

      <motion.p 
        className="text-lg text-gray-700 text-center mb-10"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        We take pride in our students' academic and co-curricular accomplishments.
      </motion.p>

      {/* Visually enhanced grid of achievements (no images) */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((item, idx) => {
            const Icon = item.icon as any;
            return (
              <motion.div
                key={idx}
                className="bg-white rounded-lg shadow-md p-5 flex items-start space-x-4 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.04 }}
              >
                <div className="flex-shrink-0">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-700 flex items-center justify-center text-white text-xl shadow">
                    <Icon />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-green-800">{item.title}</h3>
                    <span className="ml-auto text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{item.category}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Quote */}
      <div className="mt-12 text-center">
        <motion.blockquote 
          className="italic text-green-700 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          "Excellence is not a skill, it’s an attitude – and our students prove it every year."
        </motion.blockquote>
      </div>
    </div>
  );
};

export default Achievements;
