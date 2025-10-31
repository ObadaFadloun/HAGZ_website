import React from "react";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function DateSelector({ selectedDate, setSelectedDate, darkMode }) {
    const today = new Date().toISOString().slice(0, 10);


    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
            <motion.h4
                className="font-semibold flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <Calendar size={18} /> Select Date
            </motion.h4>

            <motion.input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={today}
                className={`mt-2 p-2 rounded w-full cursor-pointer ${darkMode ? "bg-gray-700" : "bg-gray-50"
                    }`}
                whileFocus={{ scale: 1.02 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
            />
        </motion.div>
    );
}
