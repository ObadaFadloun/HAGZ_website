import React from "react";
import { motion } from "framer-motion";

export default function FacilitiesCard({ field, darkMode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
            <h4 className="font-semibold">Facilities</h4>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-8 text-sm opacity-90">
                <motion.div whileHover={{ scale: 1.1 }}>
                    {field?.nightLights ? "🌙 Night lights" : "—"}
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}>
                    {field?.bathrooms ? "🚻 Bathrooms" : "—"}
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}>
                    {field?.parking ? "🚗 Parking" : "—"}
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}>
                    {field?.changingRooms ? "🧥 Changing rooms" : "—"}
                </motion.div>
            </div>
        </motion.div>
    );
}
