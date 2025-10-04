// src/pages/Fields.jsx
import { motion } from "framer-motion";
import { MapPin, Star, Clock } from "lucide-react";
import field1 from "../assets/backgroundImages/background1.jpg";
import field2 from "../assets/backgroundImages/background2.jpg";
import field3 from "../assets/backgroundImages/background3.jpg";

// Animation Variants
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Example field data
const fields = [
  {
    id: 1,
    name: "Green Arena",
    location: "Downtown Cairo",
    price: "$25 / hour",
    rating: 4.7,
    available: "Available Today",
    features: ["Night Lights", "Showers", "Parking"],
    image: field1,
  },
  {
    id: 2,
    name: "Elite Sports Park",
    location: "Nasr City",
    price: "$30 / hour",
    rating: 4.9,
    available: "Available Tomorrow",
    features: ["Synthetic Turf", "Locker Rooms", "Cafeteria"],
    image: field2,
  },
  {
    id: 3,
    name: "Victory Stadium",
    location: "Giza",
    price: "$40 / hour",
    rating: 5.0,
    available: "Weekend Only",
    features: ["Professional Size", "Seating", "Referee Service"],
    image: field3,
  },
];

export default function Fields({ darkMode }) {
  return (
    <section
      id="fields"
      className={`min-h-screen flex items-center justify-center px-6 md:px-20 py-20 bg-gradient-to-br ${darkMode ? "from-gray-900 dark:to-gray-800" : "from-gray-50 to-gray-400"}`}
    >
      <motion.div
        className="max-w-7xl mx-auto w-full space-y-12"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Header */}
        <motion.div className="text-center space-y-6" variants={fadeUp}>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Discover Football Fields
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-gray-300" : "text-gray-950"}`}>
            Find and book the best football pitches around you — easy, fast, and
            hassle-free. Play your game the professional way ⚽
          </p>
        </motion.div>

        {/* Fields Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-10"
          variants={container}
        >
          {fields.map((field, idx) => (
            <motion.div
              key={field.id}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              className={`${darkMode ? "bg-gray-900" : "bg-white"} rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition`}
            >
              {/* Image with overlay */}
              <div className="relative group">
                <img
                  src={field.image}
                  alt={field.name}
                  className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-lg transition">
                  View Details
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-3">
                <h3 className="text-2xl font-bold text-green-700">
                  {field.name}
                </h3>
                <p className={`flex items-center gap-2 ${darkMode ? "text-gray-400" : "text-gray-600 "}`}>
                  <MapPin size={18} /> {field.location}
                </p>
                <p className="flex items-center text-yellow-500 font-semibold gap-2">
                  <Star size={18} className="text-yellow-400" /> {field.rating} / 5
                </p>
                <p className="flex items-center text-sm text-green-600 gap-2">
                  <Clock size={16} /> {field.available}
                </p>
                <p className="text-green-600 font-semibold">{field.price}</p>

                {/* Features */}
                <ul className="flex flex-wrap gap-2 mt-2">
                  {field.features.map((feature, i) => (
                    <span
                      key={i}
                      className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  Book Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
