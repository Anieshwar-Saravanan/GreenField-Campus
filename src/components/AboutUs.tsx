import React from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaTrophy } from 'react-icons/fa';

const AboutUs: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold text-green-800 mb-10 text-center border-b-4 border-green-400 inline-block">
        About Greenfield Campus
      </h1>

      {/* Vision & Mission - updated with attractive cards */}
      <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-6 shadow-lg border border-emerald-100"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-emerald-600 flex items-center justify-center text-white mr-3">
              <FaCrown />
            </div>
            <h3 className="text-2xl font-bold text-green-800">Our Vision</h3>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            The vision of Green Fields School is to nurture a generation of confident, compassionate, and creative learners who grow in harmony with nature and society. Our goal is to provide a learning environment where academic excellence blends with environmental awareness, character development, and global citizenship.
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed text-lg">
            Through innovative teaching, sustainability practices, and community engagement, we aim to cultivate young minds that think critically, act responsibly, and care deeply for the world around them. At Green Fields, every child is encouraged to explore, dream, and grow like seeds planted in rich soil — flourishing into responsible individuals who contribute positively to a greener, brighter future.
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-6 shadow-lg border border-emerald-100"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-green-700 flex items-center justify-center text-white mr-3">
              <FaTrophy />
            </div>
            <h3 className="text-2xl font-bold text-green-800">Our Mission</h3>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            Guided by our mission to <strong>Educate, Empower, and Excel</strong>, we strive to inspire lifelong learning, instill strong values, and equip our students with the skills and confidence to lead with purpose and make a meaningful difference in the world.
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed text-lg">
            We focus on holistic development — academic rigor, character-building, environmental stewardship, and community service — so every student graduates ready to succeed and contribute positively to society.
          </p>
        </motion.div>
      </section>

      {/* Correspondent's Note */}
      <section className="mb-12 bg-white p-6 rounded-xl border-l-8 border-green-400 shadow">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">Correspondent's Note</h2>
        <blockquote className="text-gray-600 italic text-lg relative pl-6">
          <span className="absolute left-0 top-0 text-green-500 text-3xl font-serif">“</span>
          Dear Parents, Students, and Well-wishers,
Warm greetings from Greenfield Campus!
It gives me immense pride and joy to welcome you to our institution, a place where education meets
character, and dreams take root in a nurturing and vibrant environment.
At Greenfield, we believe that education is not just about academics, but about building lives. Our
school stands as a beacon of quality education, offering a balanced platform that combines academic
excellence, moral values, discipline, and creativity. From excelled academics to state-level sports
achievements, from hands-on competitions to educational trips—we ensure our students receive every
opportunity to grow into confident and capable individuals.
Our lush green campus isn’t just a backdrop—it’s a part of our philosophy. The calm and eco-friendly
surroundings play a key role in developing focus, respect for nature, and emotional well-being in our
children.
One of our proudest moments each year is our Grand Annual Day celebration, where we’ve had the
honor of hosting some of the country’s most distinguished personalities. Their presence inspires our
students to dream big and achieve more.
We remain committed to building a generation of students who are not only successful in their careers
but also grounded in values, strong in character, and ready to lead in an ever-changing world.
Thank you for being a part of our journey. Let us continue to work together in shaping bright futures.

          <br />
          <span className="block mt-4 font-semibold text-green-700">Warm regards,<br />
D. Herald Sham
Correspondent
Greenfield Campus (VCSM Matriculation Higher Secondary School)</span>
        </blockquote>
      </section>

      {/* Key Points */}
      <section className="mb-12 bg-emerald-50 p-6 rounded-xl shadow-md border-l-4 border-emerald-400">
        <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Key Points</h2>
        <ul className="list-disc pl-8 space-y-2 text-lg text-gray-700">
          <li><strong>Green and Peaceful Campus</strong><br />
The school is known for its beautifully maintained, plant-rich surroundings that promote calmness,
focus, and overall student well-being.</li>
          <li><strong>Sports and State-Level Participation</strong><br />
Students regularly represent the school in district and state-level competitions, excelling in sports
such as hockey, kabaddi, and athletics, fostering teamwork, discipline, and physical strength.</li>
          <li><strong>Creative and Skill-Based Activities</strong><br />
Participation in drawing, clay modeling, craft making, and similar competitions is actively encouraged,
allowing students to explore and showcase their creativity.</li>
          <li><strong>School Band and Assembly Activities</strong><br />
The school maintains a well-trained band that performs at key events and parades. Student-led
assembly sessions build leadership, confidence, and communication skills through speeches,
presentations, and themed programs.</li>
          <li><strong>Educational Trips Across All Grades</strong><br />
The management organizes well-planned educational trips for students from Kindergarten to Higher
Secondary. These trips provide joyful learning experiences and broaden the students’ understanding
of the world beyond textbooks.</li>
          <li><strong>Frequent Competitions and Recognition</strong><br />
Academic, cultural, and skill-based competitions are conducted regularly. Students are recognized
and rewarded for their achievements, promoting a spirit of healthy competition and personal growth.</li>
        </ul>
      </section>

      {/* Milestones removed - keep here for future content or reintroduce as needed. */}
    </div>
  );
};

export default AboutUs;
