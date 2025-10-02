// src/pages/About.jsx
import { motion } from "framer-motion";
import aboutImg from "../assets/backgroundImages/background1.jpg";
import AnimatedText from "../components/AnimatedText";

export default function About() {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-400 px-6 md:px-20 py-20"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Text Section */}
        <div className="space-y-6">
          <AnimatedText
            text="About HAGZ"
            className="text-4xl md:text-5xl font-extrabold leading-snug bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-lg text-gray-700 leading-relaxed"
          >
            <span className="font-semibold">HAGZ</span> is your ultimate football field booking platform — designed to make finding, booking, and playing on your favorite pitch seamless and fun.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-lg text-gray-700 leading-relaxed"
          >
            From casual kickabouts to serious league matches, HAGZ gives you{" "}
            <span className="font-semibold text-green-600">instant access</span> to the best fields near you, with live availability, secure payments, and exclusive offers.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            viewport={{ once: true }}
            className="text-lg text-gray-700 leading-relaxed"
          >
            We’re building more than just a booking system —{" "}
            <span className="font-semibold text-green-600">we’re building a community</span>. With team-finding tools, loyalty rewards, ratings, and weather updates, HAGZ is where your football journey begins.
          </motion.p>
        </div>

        {/* Image Section */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <img
            src={aboutImg}
            alt="Football players"
            className="rounded-2xl shadow-xl w-full max-w-md md:max-w-lg transform hover:scale-105 transition duration-500"
          />
        </motion.div>
      </div>
    </section>
  );
}
