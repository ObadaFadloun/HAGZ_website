// src/pages/Booking/components/MapSection.jsx
import React from "react";
import { motion } from "framer-motion";

export default function MapSection({ mapLink, location }) {
    if (!mapLink && !location) {
        return (
            <motion.div
                className="flex items-center justify-center h-64 text-gray-500 rounded-lg overflow-hidden shadow"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                Location not available
            </motion.div>
        );
    }

    let mapSrc = "";

    // Try to extract coordinates from mapLink
    const match = mapLink?.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
        const [_, lat, lon] = match;
        mapSrc = `https://www.google.com/maps?q=${lat},${lon}&output=embed`;
    } else if (location) {
        mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
            location
        )}&output=embed`;
    } else {
        mapSrc = mapLink;
    }

    return (
        <motion.div
            className="flex-1 rounded-lg overflow-hidden shadow-lg relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.02, boxShadow: "0px 10px 30px rgba(0,0,0,0.25)" }}
        >
            <iframe
                title="Field Location"
                src={mapSrc}
                className="w-full h-64 border-0 rounded-lg"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </motion.div>
    );
}
