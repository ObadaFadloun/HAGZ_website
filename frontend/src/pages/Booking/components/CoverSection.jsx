// src/pages/Booking/components/CoverSection.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Sun, Moon } from "lucide-react";
import Button from "../../../components/Button";
import formatRating from "../../../utils/format"

export default function CoverSection({ field, darkMode, setDarkMode, navigate }) {
    const [coverIndex, setCoverIndex] = useState(0);
    const images = (field?.images || [])
        .map((i) => (typeof i === "string" ? i : i?.url || ""))
        .filter(Boolean);
    const displayed = images[coverIndex] || images[0] || "";

    // Auto-change cover every 5s
    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(
            () => setCoverIndex((prev) => (prev + 1) % images.length),
            5000
        );
        return () => clearInterval(interval);
    }, [images]);

    return (
        <section
            className={`relative h-64 sm:h-96 overflow-hidden ${darkMode
                    ? "bg-gray-800"
                    : "bg-gradient-to-b from-green-600 to-green-400"
                }`}
        >
            {/* --- Background Images (Animated only) --- */}
            <div className="absolute inset-0">
                <AnimatePresence mode="wait">
                    {displayed ? (
                        <motion.img
                            key={displayed}
                            src={displayed}
                            alt={field?.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-90"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                    ) : (
                        <motion.div
                            key="no-cover"
                            className="absolute inset-0 flex items-center justify-center text-3xl font-bold opacity-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            No cover
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Overlay */}
                <motion.div
                    className="absolute inset-0 bg-black/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 1 }}
                />
            </div>

            {/* --- Static Content (Does NOT re-render on image change) --- */}
            <div className="absolute inset-0 flex flex-col justify-between p-4">
                {/* Buttons (top) */}
                <div className="flex justify-between">
                    <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
                        <Button
                            onClick={() => navigate(-1)}
                            className="w-14 h-14 flex justify-center items-center bg-white/20 backdrop-blur rounded-full cursor-pointer"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={18} className="text-white" />
                        </Button>
                    </motion.div>

                    <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
                        <Button
                            className={`z-10 w-14 h-14 flex justify-center items-center rounded-full shadow-md transition-all ${darkMode
                                    ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                                    : "bg-gradient-to-br from-gray-800 to-gray-900 text-yellow-300"
                                }`}
                            onClick={() => setDarkMode(!darkMode)}
                        >
                            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
                        </Button>
                    </motion.div>
                </div>

                {/* Text (bottom) */}
                <motion.div
                    className="text-white max-w-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h1 className="text-2xl sm:text-4xl font-extrabold flex items-center gap-3">
                        {field?.name}
                        <span className="text-yellow-300 flex items-center gap-1 text-base">
                            <Star size={18} /> {formatRating(field?.averageRating) ?? "—"}
                        </span>
                    </h1>

                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 text-sm opacity-90">
                            {field?.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm opacity-90">
                            {field?.openTime} - {field?.closeTime}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
