import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

export default function AdminDashboard({ user, onLogout, darkMode, setDarkMode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex min-h-screen h-screen overflow-hidden">
            {/* Sidebar with motion slide-in */}
            <motion.div
                initial={{ x: -250, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full"
            >
                <Sidebar
                    user={user}
                    onLogout={onLogout}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    isOpen={isSidebarOpen}
                    setIsOpen={setIsSidebarOpen}
                />
            </motion.div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
                className={`flex-1 flex flex-col overflow-y-scroll transition-colors duration-300 
                ${darkMode
                        ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300"
                        : "bg-gradient-to-br from-gray-50 to-gray-300 text-gray-950"
                    }`}
            >
                {/* Top Navbar */}
                <motion.header
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`shadow px-6 py-4 flex justify-between items-center transition-colors duration-300
                    ${darkMode ? "bg-gray-800" : "bg-gradient-to-r from-gray-100 to-gray-300"}`}
                >
                    <h1
                        className={`text-xl font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}
                    >
                        Admin Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <motion.input
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 180, opacity: 1 }}
                            transition={{ duration: 0.6 }}
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
                <main className="p-6 flex-1 space-y-6">
                    {/* Stats Cards */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: { staggerChildren: 0.15 },
                            },
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {[{ title: "Total Bookings", value: "120" },
                        { title: "Active Players", value: "340" },
                        { title: "Revenue", value: "$5,430" }].map((stat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05, rotate: 1 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className={`p-6 rounded-xl shadow-lg transition-all duration-300 
                                ${darkMode
                                        ? "bg-gradient-to-br from-gray-800 to-gray-700 hover:shadow-green-500/30"
                                        : "bg-gradient-to-br from-white to-gray-200 hover:shadow-green-300/30"}`}
                            >
                                <h3 className="text-lg font-semibold">{stat.title}</h3>
                                <motion.p
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    className="text-3xl font-bold text-green-600"
                                >
                                    {stat.value}
                                </motion.p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Recent Bookings Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`p-6 rounded-xl shadow-lg transition-all duration-300
                        ${darkMode
                                ? "bg-gradient-to-br from-gray-800 to-gray-700"
                                : "bg-gradient-to-br from-white to-gray-200"}`}
                    >
                        <h3
                            className={`text-lg font-semibold mb-4 
                            ${darkMode ? "text-green-400" : "text-green-600"}`}
                        >
                            Recent Bookings
                        </h3>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <motion.tr
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className={`border-b font-medium
                                    ${darkMode
                                            ? "border-gray-700 text-green-400"
                                            : "border-gray-400 text-green-600"}`}
                                >
                                    <th className="p-2">Player</th>
                                    <th className="p-2">Field</th>
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Status</th>
                                </motion.tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: "Ahmed Ali", field: "Green Arena", date: "Oct 5, 2025", status: "Confirmed", color: "text-green-600" },
                                    { name: "Omar Youssef", field: "Elite Park", date: "Oct 7, 2025", status: "Pending", color: "text-yellow-500" }
                                ].map((row, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className={`${darkMode ? "border-b border-gray-700" : "border-b border-gray-400"}`}
                                    >
                                        <td className="p-2">{row.name}</td>
                                        <td className="p-2">{row.field}</td>
                                        <td className="p-2">{row.date}</td>
                                        <td className={`p-2 ${row.color}`}>{row.status}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </main>
            </motion.div>
        </div>
    );
}
