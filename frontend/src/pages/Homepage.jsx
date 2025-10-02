import { useState, useEffect } from "react";
import { Sun, Moon, Shield, Star, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage({ darkMode }) {
  const navigate = useNavigate();

  const autoplay = Autoplay({ delay: 4000 });
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);

  const images = Object.values(
    import.meta.glob("../assets/backgroundImages/*.{jpg,png,jpeg,svg}", { eager: true })
  ).map((mod) => mod.default);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <main>
      <div className={darkMode ? "dark" : ""}>
        <div className="min-h-screen bg-gradient-to-r form-gray-100 to-gray-300 dark:bg-gray-100 text-gray-900 dark:text-black">

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
                onClick={() => navigate("/auth")}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl hover:bg-green-700 transform transition duration-500 ease-in-out hover:scale-105 hover:shadow-xl"
              >
                Find a Field
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                className="px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-400 text-gray-900 rounded-xl hover:bg-gray-200 transform transition duration-500 ease-in-out hover:scale-105 hover:shadow-xl"
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
                >
                  <item.icon className="mx-auto mb-3 w-10 h-10 text-green-600" />
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Popular Fields */}
          <section className="py-16 px-6 md:px-12 bg-gradient-to-r from-gray-300 to-gray-500 dark:bg-gray-300 relative">
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
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                    className="flex-shrink-0 w-full m-2 sm:w-100 bg-gradient-to-r from-gray-700 to-gray-900 dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden transform transition duration-500 ease-in-out hover:scale-105 hover:shadow-xl"
                  >
                    <img
                      src={images[(i - 1) % 3]}
                      alt="Field"
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-yellow-500 font-semibold">⭐ 4.5</span>
                      <Button className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg hover:bg-green-700 transform transition duration-500 ease-in-out hover:scale-105 hover:shadow-xl">
                        Book Now
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={scrollPrev}
              className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-3 hover:bg-opacity-80 cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-3 hover:bg-opacity-80 cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="p-6 bg-gradient-to-r from-green-400 to-gray-500 rounded-xl text-center"
              >
                <h4 className="text-xl font-bold">PROMO CODE</h4>
                <p className="text-2xl">Get 20% OFF</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="p-6 bg-gradient-to-r from-red-400 to-gray-500 rounded-xl text-center"
              >
                <h4 className="text-xl font-bold">DISCOUNT</h4>
                <p className="text-2xl">15% OFF</p>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
