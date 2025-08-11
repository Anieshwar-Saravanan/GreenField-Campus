import React from 'react';
import { FaCrown, FaTrophy, FaChalkboardTeacher, FaCheckCircle } from 'react-icons/fa';

const AboutUs: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold text-green-800 mb-10 text-center border-b-4 border-green-400 inline-block">
        About Greenfield Campus
      </h1>

      {/* Vision & Mission */}
      <section className="mb-12 bg-green-50 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-green-700 mb-3 border-l-4 border-green-500 pl-4">Vision & Mission</h2>
        <p className="text-white-700 text-lg leading-relaxed">
          At <span className="font-semibold text-emerald-700">Greenfield Campus</span>Greenfield Campus (VCSM Matriculation Higher Secondary School) is dedicated to shaping the future
through quality education, value-based learning, and holistic student development. Every child is
empowered to reach their full potential through a balanced blend of academics, discipline, creativity,
and care.
The campus is surrounded by lush greenery, filled with a wide variety of plants that create a peaceful
and eco-friendly atmosphere. This natural setting contributes to a healthy and inspiring learning
environment.
          <span className="italic text-green-600 "><strong>"Educate, Empower, and Excel"</strong></span>
        </p>
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
excellence, moral values, discipline, and creativity. From NEET-focused training to state-level sports
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
          <li><strong>Academic Excellence with NEET Coaching</strong><br />
Greenfield Campus offers a strong academic foundation along with specialized NEET training to
prepare higher secondary students for competitive medical entrance exams.</li>
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

      {/* Milestones */}
      {/* <section>
        <h2 className="text-2xl font-semibold text-green-700 mb-6 border-l-4 border-green-500 pl-4">Milestones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start bg-white p-4 rounded-lg shadow">
            <FaCrown className="text-green-600 text-2xl mr-4 mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-gray-800">1995 – School Established</h3>
              <p className="text-sm text-gray-600">Founded with a vision to transform education in our region.</p>
            </div>
          </div>
          <div className="flex items-start bg-white p-4 rounded-lg shadow">
            <FaTrophy className="text-yellow-500 text-2xl mr-4 mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-gray-800">2005 – First State Rank</h3>
              <p className="text-sm text-gray-600">Our students began topping state exams with flying colors.</p>
            </div>
          </div>
          <div className="flex items-start bg-white p-4 rounded-lg shadow">
            <FaChalkboardTeacher className="text-blue-500 text-2xl mr-4 mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-gray-800">2015 – Smart Classrooms Introduced</h3>
              <p className="text-sm text-gray-600">We integrated smart tech into our teaching ecosystem.</p>
            </div>
          </div>
          <div className="flex items-start bg-white p-4 rounded-lg shadow">
            <FaCheckCircle className="text-green-500 text-2xl mr-4 mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-gray-800">2020 – 100% Board Exam Pass Rate</h3>
              <p className="text-sm text-gray-600">A proud year of 100% pass rate and distinction for many.</p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default AboutUs;
