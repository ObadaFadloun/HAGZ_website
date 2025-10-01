import { useState, useEffect } from "react";
import { Sun, Moon, Calendar, MapPin, Clock, Shield, Star, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
                <div className="min-h-screen bg-gray-300 dark:bg-gray-100 text-gray-900 dark:text-black">
                    {/* Hero */}
                    <section
                        className="relative bg-cover bg-center h-[60vh] md:h-[75vh] flex flex-col justify-center items-center text-center px-4"
                        style={{ backgroundImage: `url(${images[currentIndex]})` }}
                    >
                        <div className="absolute inset-0 bg-black/50"></div>
                        <h2 className="relative text-3xl md:text-6xl font-bold text-white max-w-3xl">
                            Book Your Field in Seconds
                        </h2>

                        <div className="relative mt-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                            <Button onClick={() => navigate("/auth")} className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transform transition duration-500 ease-in-out 
                hover:scale-105 hover:shadow-xl">
                                Find a Field
                            </Button>
                            <Button onClick={() => navigate("/auth")} className="px-6 py-3 bg-white text-gray-900 rounded-xl hover:bg-gray-200 transform transition duration-500 ease-in-out 
                hover:scale-105 hover:shadow-xl">
                                Become an Owner
                            </Button>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="py-16 px-6 md:px-12">
                        <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-green-600">Features</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <Shield className="mx-auto mb-3 w-10 h-10 text-green-600" />
                                <h4 className="font-semibold">Easy Booking</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Book in seconds with simple steps</p>
                            </div>
                            <div>
                                <Shield className="mx-auto mb-3 w-10 h-10 text-green-600" />
                                <h4 className="font-semibold">Secure Payments</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Fast & safe transactions</p>
                            </div>
                            <div>
                                <Star className="mx-auto mb-3 w-10 h-10 text-green-600" />
                                <h4 className="font-semibold">Loyalty Program</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Earn rewards & discounts</p>
                            </div>
                            <div>
                                <Gift className="mx-auto mb-3 w-10 h-10 text-green-600" />
                                <h4 className="font-semibold">Weather Updates</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Check weather before booking</p>
                            </div>
                        </div>
                    </section>

                    {/* Popular Fields */}
                    <section className="py-16 px-6 md:px-12 bg-gray-50 dark:bg-gray-300 relative">
                        <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-green-600">Popular Fields</h3>

                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex gap-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                    <div key={i} className="flex-shrink-0 w-full m-2 sm:w-100 bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden transform transition duration-500 ease-in-out hover:scale-105 hover:shadow-xl">
                                        <img
                                            src={images[(i - 1) % 3]}
                                            alt="Field"
                                            className="h-48 w-full object-cover"
                                        />
                                        <div className="p-4 flex justify-between items-center">
                                            <span className="text-yellow-500 font-semibold">⭐ 4.5</span>
                                            <Button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transform transition duration-500 ease-in-out hover:scale-105 hover:shadow-xl">
                                                Book Now
                                            </Button>
                                        </div>
                                    </div>
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
                        <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-green-600">Special Offers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
                            <div className="p-6 bg-green-200 rounded-xl text-center">
                                <h4 className="text-xl font-bold">PROMO CODE</h4>
                                <p className="text-2xl">Get 20% OFF</p>
                            </div>
                            <div className="p-6 bg-red-200 rounded-xl text-center">
                                <h4 className="text-xl font-bold">DISCOUNT</h4>
                                <p className="text-2xl">15% OFF</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
