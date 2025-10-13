import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

export default function PlayerDashboard({ user, onLogout, darkMode, setDarkMode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <div className="flex min-h-screen h-screen">
            {/* Sidebar */}
            <Sidebar
                user={user}
                onLogout={onLogout}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            {/* Main Content */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className={`flex-1 flex flex-col overflow-y-scroll transition-colors duration-300
                ${darkMode
                        ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300"
                        : "bg-gradient-to-br from-gray-50 to-gray-300 text-gray-950"
                    }`}
            >
                {/* Top Navbar */}
                <motion.header
                    variants={itemVariants}
                    className={`shadow px-6 py-4 flex justify-between items-center transition-colors duration-300
                    ${darkMode ? "bg-gray-800" : "bg-gradient-to-r from-gray-100 to-gray-300"}`}
                >
                    <h1
                        className={`text-xl font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}
                    >
                        Player Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className={`px-3 py-2 rounded-lg border shadow-sm
                            ${darkMode
                                    ? "border-gray-700 bg-gray-700 text-white placeholder:text-gray-400"
                                    : "border-gray-300 bg-white text-gray-950 placeholder:text-gray-500"
                                }`}
                        />
                    </div>
                </motion.header>

                {/* Content */}
                <motion.main
                    variants={containerVariants}
                    className="p-6 flex-1 space-y-6"
                >
                    {/* Loyalty Points */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-xl shadow-lg transition-all duration-300
                        ${darkMode
                                ? "bg-gradient-to-br from-gray-800 to-gray-700 hover:shadow-green-500/30"
                                : "bg-gradient-to-br from-white to-gray-200 hover:shadow-green-300/30"}`}
                    >
                        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                            Loyalty Points
                        </h3>
                        <div className={`w-full rounded-full h-4 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "65%" }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="bg-green-600 h-4 rounded-full"
                            ></motion.div>
                        </div>
                        <p className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            650 / 1000 points
                        </p>
                    </motion.div>

                    {/* My Bookings */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-xl shadow-lg transition-all duration-300
                        ${darkMode
                                ? "bg-gradient-to-br from-gray-800 to-gray-700"
                                : "bg-gradient-to-br from-white to-gray-200"}`}
                    >
                        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                            My Bookings
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { field: "Green Arena", date: "Oct 15, 2025", status: "Confirmed", color: "text-green-600" },
                                { field: "Elite Park", date: "Oct 18, 2025", status: "Pending", color: "text-yellow-500" }
                            ].map((booking, i) => (
                                <motion.li
                                    key={i}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.03 }}
                                    className={`flex justify-between p-3 rounded-lg border cursor-pointer ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
                                >
                                    <span>{`${booking.field} - ${booking.date}`}</span>
                                    <span className={booking.color}>{booking.status}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Favorite Fields */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-xl shadow-lg transition-all duration-300
                        ${darkMode
                                ? "bg-gradient-to-br from-gray-800 to-gray-700"
                                : "bg-gradient-to-br from-white to-gray-200"}`}
                    >
                        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                            Favorite Fields
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {["Dream Arena", "Elite Park"].map((field, i) => (
                                <motion.div
                                    key={i}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                    className={`border p-4 rounded-lg text-center ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
                                >
                                    {field}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Notifications */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-xl shadow-lg transition-all duration-300
                        ${darkMode
                                ? "bg-gradient-to-br from-gray-800 to-gray-700"
                                : "bg-gradient-to-br from-white to-gray-200"}`}
                    >
                        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                            Notifications
                        </h3>
                        <motion.ul variants={containerVariants} className="space-y-3">
                            {[
                                "🎉 You earned 50 loyalty points!",
                                "⚽ Your booking at Green Arena is confirmed."
                            ].map((notif, i) => (
                                <motion.li
                                    key={i}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.03 }}
                                    className={`border p-3 rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
                                >
                                    {notif}
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>
                </motion.main>
            </motion.div>
        </div>
    );
}
