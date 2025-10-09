import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import Button from "../components/Button";
import Sidebar from "../components/Sidebar";

export default function AdminDashboard({ user, onLogout, darkMode, setDarkMode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex min-h-screen h-screen">
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
                        Admin Dashboard
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

                        <Button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-full shadow-md transition-all duration-300 cursor-pointer
                        ${darkMode
                                    ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                                    : "bg-gradient-to-br from-gray-800 to-gray-900 text-yellow-300"} 
                        hover:scale-110 hover:rotate-12`}
                        >
                            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
                        </Button>

                    </div>
                </header>

                {/* Content */}
                <main className="p-6 flex-1 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "Total Bookings", value: "120" },
                            { title: "Active Players", value: "340" },
                            { title: "Revenue", value: "$5,430" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className={`p-6 rounded-xl shadow-lg transition-all duration-300 
                                ${darkMode
                                        ? "bg-gradient-to-br from-gray-800 to-gray-700 hover:shadow-green-500/30"
                                        : "bg-gradient-to-br from-white to-gray-200 hover:shadow-green-300/30"}`}
                            >
                                <h3 className="text-lg font-semibold">{stat.title}</h3>
                                <p className="text-3xl font-bold text-green-600">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Recent Bookings Table */}
                    <div
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
                                <tr
                                    className={`border-b font-medium
                                    ${darkMode
                                            ? "border-gray-700 text-green-400"
                                            : "border-gray-400 text-green-600"}`}
                                >
                                    <th className="p-2">Player</th>
                                    <th className="p-2">Field</th>
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={darkMode ? "border-b border-gray-700" : "border-b border-gray-400"}>
                                    <td className="p-2">Ahmed Ali</td>
                                    <td className="p-2">Green Arena</td>
                                    <td className="p-2">Oct 5, 2025</td>
                                    <td className="p-2 text-green-600">Confirmed</td>
                                </tr>
                                <tr className={darkMode ? "border-b border-gray-700" : "border-b border-gray-400"}>
                                    <td className="p-2">Omar Youssef</td>
                                    <td className="p-2">Elite Park</td>
                                    <td className="p-2">Oct 7, 2025</td>
                                    <td className="p-2 text-yellow-500">Pending</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}
