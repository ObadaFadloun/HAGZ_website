import { useState, useEffect } from "react";
import { Shield, Star, Gift, MapIcon, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import api from "../utils/api"

export default function LandingPage({ darkMode }) {
  const [popularFields, setPopularFields] = useState([]);
  const navigate = useNavigate();

  const autoplay = Autoplay({ delay: 4000 });
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);

  const handleAuth = () => {
    navigate("/auth");
  };

  const images = Object.values(
    import.meta.glob("../assets/backgroundImages/*.{jpg,png,jpeg,svg}", {
      eager: true,
    })
  ).map((mod) => mod.default);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPopularFields = async () => {
      try {
        const res = await api.get("/football-fields/public");
        setPopularFields(res.data.data.fields);
      } catch (err) {
        console.error("❌ Failed to fetch popular fields:", err);
      }
    };
    fetchPopularFields();
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentIndex((i) => (i + 1) % images.length),
      5000
    );
    return () => clearInterval(interval);
  }, [images.length]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <main>
      <div
        className={`min-h-screen bg-gradient-to-br ${darkMode
          ? "from-gray-900 to-gray-800 text-gray-300"
          : "from-gray-50 to-gray-400 text-gray-900"
          }`}
      >
        {/* Hero */}
        <section
          className="relative bg-cover bg-center h-[60vh] md:h-[75vh] flex flex-col justify-center items-center text-center px-4"
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <motion.h2
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative text-3xl md:text-6xl font-bold text-white max-w-3xl"
          >
            Book Your Field in Seconds
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="relative mt-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4"
          >
            <Button
              onClick={handleAuth}
              className="px-6 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-md shadow-md"
            >
              Find a Field
            </Button>
            <Button
              onClick={handleAuth}
              className="px-6 bg-gradient-to-r from-gray-200 to-gray-400 text-green-700 rounded-md shadow-md"
            >
              Become an Owner
            </Button>
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-16 px-6 md:px-12">
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-3xl font-bold text-center mb-10 text-green-600"
          >
            Features
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Shield, title: "Easy Booking", desc: "Book in seconds with simple steps" },
              { icon: Shield, title: "Secure Payments", desc: "Fast & safe transactions" },
              { icon: Star, title: "Loyalty Program", desc: "Earn rewards & discounts" },
              { icon: Gift, title: "Weather Updates", desc: "Check weather before booking" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-900"
                  }`}
              >
                <item.icon className="mx-auto mb-3 w-10 h-10 text-green-600" />
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm opacity-80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Popular Fields */}
        <section
          className={`py-16 px-6 md:px-12 relative ${darkMode ? "bg-gray-800" : "bg-gray-200"
            }`}
        >
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-3xl font-bold text-center mb-10 text-green-600"
          >
            Popular Fields
          </motion.h3>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {popularFields.map((field, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.15 }}
                  className={`flex-shrink-0 w-full m-2 sm:w-100 rounded-xl shadow-lg overflow-hidden transform transition duration-500 ease-in-out hover:scale-105 hover:shadow-xl ${darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                >
                  <img
                    src={
                      field.images?.[0]?.url ||
                      field.image ||
                      "https://via.placeholder.com/400x250?text=Football+Field"
                    }
                    alt={field.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold truncate">{field.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <MapPin size={14} /> <span>{field.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-green-600 font-bold">
                        ${field.pricing} <span className="text-sm text-gray-500">/ hr</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        <Star size={14} />{" "}
                        <span>{field.averageRating ?? "—"}</span>
                      </div>
                    </div>
                    <div className="py-4 text-right">
                      <Button onClick={handleAuth} className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg shadow-md hover:scale-105 transition">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            onClick={scrollPrev}
            className="absolute top-1/2 left-5 -translate-y-1/2 bg-green-600 text-white bg-opacity-50 rounded-full hover:bg-opacity-80"
          >
            <ChevronLeft size={24} />
          </Button>
          <Button
            onClick={scrollNext}
            className="absolute top-1/2 right-5 -translate-y-1/2 bg-green-600 text-white bg-opacity-50 rounded-full p-3 hover:bg-opacity-80"
          >
            <ChevronRight size={24} />
          </Button>
        </section>

        {/* Special Offers */}
        <section className="py-16 px-6 md:px-12">
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-3xl font-bold text-center mb-10 text-green-600"
          >
            Special Offers
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`p-6 rounded-xl text-center ${darkMode
                ? "bg-gradient-to-r from-green-600 to-gray-700"
                : "bg-gradient-to-r from-green-400 to-gray-500"
                }`}
            >
              <h4 className="text-xl font-bold">PROMO CODE</h4>
              <p className="text-2xl">Get 20% OFF</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className={`p-6 rounded-xl text-center ${darkMode
                ? "bg-gradient-to-r from-red-600 to-gray-700"
                : "bg-gradient-to-r from-red-400 to-gray-500"
                }`}
            >
              <h4 className="text-xl font-bold">DISCOUNT</h4>
              <p className="text-2xl">15% OFF</p>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
