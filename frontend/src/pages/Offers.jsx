import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { Gift, Percent, Calendar, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Offers({ darkMode }) {
  const navigate = useNavigate();

  const offers = [
    {
      icon: Gift,
      title: "First Booking Gift 🎁",
      desc: "Get a free ball ⚽ or jersey 👕 with your first booking!",
      bg: "bg-green-100",
    },
    {
      icon: Percent,
      title: "Season Discount 💸",
      desc: "Save up to 25% on weekday morning matches ⏰",
      bg: "bg-yellow-100",
    },
    {
      icon: Calendar,
      title: "Birthday Package 🎉",
      desc: "Celebrate your birthday with exclusive field deals 🎂",
      bg: "bg-pink-100",
    },
    {
      icon: Star,
      title: "Loyalty Rewards ⭐",
      desc: "Play more, earn more. Redeem points for discounts 🎯",
      bg: "bg-blue-100",
    },
  ];

  return (
    <main className={`min-h-screen pt-24 pb-16 px-6 md:px-12 bg-gradient-to-br ${darkMode ? "from-gray-900 to-gray-800 text-white" : "from-gray-50 to-gray-400 text-gray-900"}`}>
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto mb-16 "
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-green-600">
          Exclusive Offers Just for You 🎁
        </h1>
        <p className={`text-lg ${darkMode ? "text-gray-50" : "text-gray-950"}`}>
          Discover amazing deals and save while enjoying your favorite games ⚽. We believe football should always be fun, affordable, and rewarding 💚.
        </p>
      </motion.section>

      {/* Offers Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {offers.map((offer, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className={`${offer.bg} rounded-xl shadow-lg p-6 flex flex-col items-center transform transition duration-500 hover:scale-105 hover:shadow-2xl`}
          >
            <offer.icon className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold text-green-700 mb-2">
              {offer.title}
            </h3>
            <p className={`${darkMode ? "text-gray-950" : "text-gray-600"} text-center`}>
              {offer.desc}
            </p>
          </motion.div>
        ))}
      </motion.section>

      {/* Call To Action */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-20 text-center"
      >
        <h2 className={`text-2xl md:text-3xl font-semibold mb-6 ${darkMode ? "text-gray-50" : "text-gray-950"}`}>
          Don't miss out on these limited-time deals 🔥
        </h2>
        <Button
          onClick={() => navigate("/auth")}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl hover:bg-green-700 transform transition duration-500 hover:scale-105 hover:shadow-xl"
        >
          Book Your Field Now ⚽
        </Button>
      </motion.section>
    </main>
  );
}
