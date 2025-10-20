import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react"; // nice icons for light/dark
import { useState } from "react";

export default function SearchAndFilterBar({
    user,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    showMyFields,
    setShowMyFields,
    darkMode
}) {
    const handleCheckboxChange = (key) => {
        setFilters({ ...filters, [key]: !filters[key] });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-wrap items-center gap-3 justify-between p-4 rounded-xl shadow-md mb-6 transition-all duration-300 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                }`}
        >
            {/* 🔍 Search Bar */}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or location..."
                className={`min-w-[350px] w-16 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${darkMode
                        ? "bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
            />

            {/* ⚙️ Filter Tags */}
            <div className="flex flex-wrap items-center gap-3 flex-1 justify-center">
                {Object.keys(filters).map((key) => (
                    <label
                        key={key}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${darkMode
                                ? "bg-gray-900 hover:bg-green-800 text-gray-200"
                                : "bg-gray-100 hover:bg-green-100 text-gray-800"
                            }`}
                    >
                        <input
                            type="checkbox"
                            checked={filters[key]}
                            onChange={() => handleCheckboxChange(key)}
                            className="accent-green-600 cursor-pointer"
                        />
                        <span className="capitalize text-sm font-medium">
                            {key.replace(/([A-Z])/g, " $1")}
                        </span>
                    </label>
                ))}
            </div>

            {/* 🧍‍♂️ My Fields Checkbox */}
            <label
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${darkMode
                        ? "bg-gray-900 hover:bg-green-800 text-gray-200"
                        : "bg-gray-100 hover:bg-green-100 text-gray-800"
                    }`}
            >
                <input
                    type="checkbox"
                    checked={showMyFields}
                    onChange={(e) => setShowMyFields(e.target.checked)}
                    className="accent-green-600 cursor-pointer"
                />
                <span>{user.role !== "player" ? "My Fields" : "My Favorite"}</span>
            </label>
        </motion.div>
    );
}
