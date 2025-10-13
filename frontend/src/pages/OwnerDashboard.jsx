import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import Button from "../components/Button";
import Sidebar from "../components/Sidebar";

export default function OwnerDashboard({ user, onLogout, darkMode, setDarkMode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex min-h-screen h-screen overflow-hidden">
            {/* Sidebar Animation */}
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
                {/* Header Animation */}
                <motion.header
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className={`shadow px-6 py-4 flex justify-between items-center transition-colors duration-300
                    ${darkMode ? "bg-gray-800" : "bg-gradient-to-r from-gray-100 to-gray-300"}`}
                >
                    <h1
                        className={`text-xl font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}
                    >
                        Owner Dashboard
                    </h1>
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
                </motion.header>

                {/* Content */}
                <main className="p-6 flex-1 space-y-6">
                    {/* Stats Cards Animation */}
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
                        {[{ title: "Earnings", value: "$12,340" },
                        { title: "Total Bookings", value: "220" },
                        { title: "Active Offers", value: "5" }].map((stat, i) => (
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

                    {/* Latest Reservations Table Animation */}
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
                            Latest Reservations
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
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className={`${darkMode ? "border-b border-gray-700" : "border-b border-gray-400"}`}
                                >
                                    <td className="p-2">Ali Hassan</td>
                                    <td className="p-2">Dream Arena</td>
                                    <td className="p-2">Oct 12, 2025</td>
                                    <td className="p-2 text-green-600">Confirmed</td>
                                </motion.tr>
                            </tbody>
                        </table>
                    </motion.div>

                    {/* Manage Fields Animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`p-6 rounded-xl shadow-lg transition-all duration-300
                        ${darkMode
                                ? "bg-gradient-to-br from-gray-800 to-gray-700"
                                : "bg-gradient-to-br from-white to-gray-200"}`}
                    >
                        <h3 className="text-lg font-semibold mb-4">Manage Fields</h3>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
                            }}
                            className="space-y-4"
                        >
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: 15 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                                className={`flex justify-between items-center p-3 rounded-lg shadow border 
                                ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
                            >
                                <span>Elite Park</span>
                                <div className="flex gap-2">
                                    <Button className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg">
                                        Edit
                                    </Button>
                                    <Button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                                        Delete
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </main>
            </motion.div>
        </div>
    );
}
