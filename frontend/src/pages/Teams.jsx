// src/pages/Teams.jsx
import { motion } from "framer-motion";
import AnimatedText from "../components/AnimatedText";

// Animation Variants
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay } },
});

export default function Teams() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-400 px-6 md:px-16 py-20">
      {/* Title */}
      <AnimatedText
        text="Find Your Perfect Team"
        className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-10"
      />

      {/* Intro Paragraph */}
      <motion.p
        variants={fadeUp(0.3)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-3xl text-lg md:text-xl text-gray-800 text-center mb-12 leading-relaxed"
      >
        At <span className="font-semibold text-green-600">HAGZ</span>, we believe football is better
        together. Whether you're searching for teammates, joining an existing squad, or looking to
        challenge another team, our platform helps you connect and build strong communities on and
        off the pitch.
      </motion.p>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
        {/* Card 1 */}
        <motion.div
          variants={fadeUp(0.5)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          className="p-6 bg-gradient-to-br from-gray-600 to-gray-950 rounded-2xl shadow-lg text-center"
        >
          <AnimatedText
            text="Create a Team"
            className="text-2xl font-bold mb-4 text-green-400"
          />
          <p className="text-gray-50">
            Start your own football team and invite your friends or open it for new players in your
            area.
          </p>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          variants={fadeUp(0.7)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          className="p-6 bg-gradient-to-br from-gray-600 to-gray-950 rounded-2xl shadow-lg text-center"
        >
          <AnimatedText
            text="Join a Squad"
            className="text-2xl font-bold mb-4 text-green-400"
          />
          <p className="text-gray-50">
            Browse available squads and instantly join a team that matches your skills and passion.
          </p>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          variants={fadeUp(0.9)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          className="p-6 bg-gradient-to-br from-gray-600 to-gray-950 rounded-2xl shadow-lg text-center"
        >
          <AnimatedText
            text="Challenge Matches"
            className="text-2xl font-bold mb-4 text-green-400"
          />
          <p className="text-gray-50">
            Set up friendly matches between teams, track results, and grow your community with fun
            competitions.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
