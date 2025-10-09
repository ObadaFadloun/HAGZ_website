import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

export default function PlayerDashboard({ user, onLogout, darkMode, setDarkMode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
            <div
                className={`flex-1 flex flex-col overflow-y-scroll transition-colors duration-300
                ${darkMode
                    ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300"
                    : "bg-gradient-to-br from-gray-50 to-gray-300 text-gray-950"
                }`}
            >
                {/* Top Navbar */}
                <header
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
                </header>

                {/* Content */}
                <main className="p-6 flex-1 space-y-6">
                    {/* Loyalty Points */}
                    <motion.div
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
                            <div className="bg-green-600 h-4 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                        <p className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            650 / 1000 points
                        </p>
                    </motion.div>

                    {/* My Bookings */}
                    <motion.div
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
                            <li className={`flex justify-between p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}>
                                <span>Green Arena - Oct 15, 2025</span>
                                <span className="text-green-600">Confirmed</span>
                            </li>
                            <li className={`flex justify-between p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}>
                                <span>Elite Park - Oct 18, 2025</span>
                                <span className="text-yellow-500">Pending</span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Favorite Fields */}
                    <motion.div
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
                            <div className={`border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} p-4 rounded-lg text-center`}>
                                Dream Arena
                            </div>
                            <div className={`border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} p-4 rounded-lg text-center`}>
                                Elite Park
                            </div>
                        </div>
                    </motion.div>

                    {/* Notifications */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-xl shadow-lg transition-all duration-300
                        ${darkMode
                            ? "bg-gradient-to-br from-gray-800 to-gray-700"
                            : "bg-gradient-to-br from-white to-gray-200"}`}
                    >
                        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                            Notifications
                        </h3>
                        <ul className="space-y-3">
                            <li className={`border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}  p-3 rounded-lg`}>
                                🎉 You earned 50 loyalty points!
                            </li>
                            <li className={`border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}  p-3 rounded-lg`}>
                                ⚽ Your booking at Green Arena is confirmed.
                            </li>
                        </ul>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
