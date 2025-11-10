import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import loadingLottie from "../assets/loading.json";
import Sidebar from "../components/Sidebar";
import api from '../utils/api';
import { capitalize } from "../utils/format";

export default function AdminDashboard({ user, onLogout, darkMode, setDarkMode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get("/admin/dashboard");
                setDashboard(res.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <motion.div
                className={`min-h-screen w-screen flex flex-col justify-center items-center ${darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-50" : ""}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <Lottie animationData={loadingLottie} loop className="w-56 h-56 mb-6" />
                <p className="text-lg animate-pulse">Loading requests...</p>
            </motion.div>
        );
    }

    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="flex min-h-screen h-screen overflow-hidden">
            {/* Sidebar */}
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
                    ${darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300" : "bg-gradient-to-br from-gray-50 to-gray-300 text-gray-950"}`}
            >
                {/* Top Navbar */}
                <motion.header
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`shadow px-6 py-4 flex justify-between items-center transition-colors duration-300
                        ${darkMode ? "bg-gray-800" : "bg-gradient-to-r from-gray-100 to-gray-300"}`}
                >
                    <h1 className={`text-xl font-bold py-2 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                        Admin Dashboard
                    </h1>
                </motion.header>

                {/* Content */}
                <main className="p-6 flex-1 space-y-6">
                    {/* Stats Cards */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {[
                            { title: "Total Bookings", value: dashboard.totalBookings },
                            { title: "Active Players", value: dashboard.activePlayers },
                            { title: "Revenue", value: dashboard.revenue + "$" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05, rotate: 1 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className={`p-6 rounded-xl shadow-lg transition-all duration-300 
                                    ${darkMode ? "bg-gradient-to-br from-gray-800 to-gray-700 hover:shadow-green-500/30" : "bg-gradient-to-br from-white to-gray-200 hover:shadow-green-300/30"}`}
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
                            ${darkMode ? "bg-gradient-to-br from-gray-800 to-gray-700" : "bg-gradient-to-br from-white to-gray-200"}`}
                    >
                        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                            Recent Bookings
                        </h3>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <motion.tr
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className={`border-b font-medium ${darkMode ? "border-gray-700 text-green-400" : "border-gray-400 text-green-600"}`}
                                >
                                    <th className="p-2">Player</th>
                                    <th className="p-2">Field</th>
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Status</th>
                                </motion.tr>
                            </thead>
                            <tbody>
                                {dashboard.recentBookings.map((rb, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className={`${darkMode ? "border-b border-gray-700" : "border-b border-gray-400"}`}
                                    >
                                        <td className="p-2">
                                            {rb.player
                                                ? `${capitalize(rb.player.firstName || "—")} ${capitalize(rb.player.lastName || "")}`
                                                : "Deleted Player"}
                                        </td>
                                        <td className="p-2">
                                            {rb.field ? capitalize(rb.field.name) : "Deleted Field"}
                                        </td>
                                        <td className="p-2">{rb.date.split("T")[0]}</td>
                                        <td className={`p-2 ${rb.status === "completed" ? "text-yellow-500" : rb.status === "active" ? "text-green-500" : "text-red-500"}`}>
                                            {capitalize(rb.status)}
                                        </td>
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
