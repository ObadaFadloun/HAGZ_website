import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../components/Button";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";
import { capitalize } from "../utils/format";
import LoadingScreen from "../components/LoadingScreen";

export default function OwnerDashboard({ user, onLogout, darkMode, setDarkMode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        earnings: 0,
        totalBookings: 0,
        activeOffers: 0,
        latestReservations: [],
        fields: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.get("/owner/dashboard");
                setDashboardData(res.data);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <LoadingScreen darkMode={darkMode} message="Loading dashboard..." />
    }

    if (error)
        return <p className="text-red-500 text-center mt-10">Error: {error}</p>;

    return (
        <div className="flex min-h-screen overflow-hidden relative">
            {/* Fixed Sidebar */}
            <div className="fixed top-0 left-0 h-screen z-50">
                <motion.div
                    initial={{ x: -250, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
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
            </div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
                className={`flex-1 flex flex-col overflow-y-scroll transition-colors duration-300 ${darkMode
                    ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300"
                    : "bg-gradient-to-br from-gray-50 to-gray-200 text-gray-950"
                    } ml-64`} // space for sidebar
            >
                {/* Header */}
                <motion.header
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className={`shadow px-6 py-4 flex justify-between items-center ${darkMode
                        ? "bg-gray-800"
                        : "bg-gradient-to-r from-gray-100 to-gray-300"
                        }`}
                >
                    <h1
                        className={`py-2 text-xl font-bold ${darkMode ? "text-green-400" : "text-green-600"
                            }`}
                    >
                        Owner Dashboard
                    </h1>
                </motion.header>

                {/* Content */}
                <main className="p-6 flex-1 space-y-6">
                    {/* Stats Section */}
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
                            { title: "Earnings", value: "$" + dashboardData.earnings },
                            { title: "Total Bookings", value: dashboardData.totalBookings },
                            { title: "Active Offers", value: dashboardData.activeOffers || 0 },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${darkMode
                                    ? "bg-gradient-to-br from-gray-800 to-gray-700 hover:shadow-green-500/30"
                                    : "bg-gradient-to-br from-white to-gray-200 hover:shadow-green-300/30"
                                    }`}
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

                    {/* Latest Reservations */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`p-6 rounded-xl shadow-lg ${darkMode
                            ? "bg-gradient-to-br from-gray-800 to-gray-700"
                            : "bg-gradient-to-br from-white to-gray-200"
                            }`}
                    >
                        <h3
                            className={`text-lg font-semibold mb-4 ${darkMode ? "text-green-400" : "text-green-600"
                                }`}
                        >
                            Latest Reservations
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr
                                        className={`${darkMode ? "text-gray-300" : "text-gray-700"
                                            } border-b`}
                                    >
                                        <th className="p-3">Player</th>
                                        <th className="p-3">Field</th>
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData.latestReservations.length > 0 ? (
                                        dashboardData.latestReservations.map((r, i) => (
                                            <motion.tr
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className={`${darkMode
                                                    ? "border-b border-gray-700 hover:bg-gray-700"
                                                    : "border-b border-gray-300 hover:bg-gray-100"
                                                    }`}
                                            >
                                                <td className="p-3">
                                                    {`${capitalize(r.player?.firstName) || ""} ${capitalize(r.player?.lastName) || ""
                                                        }`}
                                                </td>
                                                <td className="p-3">{capitalize(r.field?.name) || "—"}</td>
                                                <td className="p-3">
                                                    {new Date(r.date).toLocaleDateString()}
                                                </td>
                                                <td
                                                    className={`p-3 font-medium ${r.status === "active"
                                                        ? "text-green-500"
                                                        : "text-yellow-500"
                                                        }`}
                                                >
                                                    {capitalize(r.status)}
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="p-3 text-center text-gray-500 italic"
                                            >
                                                No recent reservations
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Manage Fields */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`p-6 rounded-xl shadow-lg ${darkMode
                            ? "bg-gradient-to-br from-gray-800 to-gray-700"
                            : "bg-gradient-to-br from-white to-gray-200"
                            }`}
                    >
                        <h3
                            className={`text-lg font-semibold mb-4 ${darkMode ? "text-green-400" : "text-green-600"
                                }`}
                        >
                            Manage Fields
                        </h3>
                        <div className="space-y-4">
                            {dashboardData.fields && dashboardData.fields.length > 0 ? (
                                dashboardData.fields.map((field, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`flex justify-between items-center p-3 rounded-lg shadow border ${darkMode
                                            ? "bg-gray-700 border-gray-600"
                                            : "bg-gray-100 border-gray-300"
                                            }`}
                                    >
                                        <span>{capitalize(field.name)}</span>
                                        <div className="flex gap-2">
                                            <Button className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg">
                                                Edit
                                            </Button>
                                            <Button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                                                Delete
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No fields found.</p>
                            )}
                        </div>
                    </motion.div>
                </main>
            </motion.div>
        </div>
    );
}
