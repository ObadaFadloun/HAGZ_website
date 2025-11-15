import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import defaultProfile from "../assets/profile-imge.png";

import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Gift,
    ShieldAlert,
    ShieldUser,
    Volleyball,
    Heart,
    Sun,
    Moon
} from "lucide-react";
import Button from "./Button";

export default function Sidebar({ user, onLogout, darkMode, setDarkMode, isOpen, setIsOpen }) {
    const menus = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", role: ["admin", "owner", "player"] },
        { name: "Owner Requests", icon: ShieldAlert, path: "/owner-requests?type=new", role: "admin" },
        { name: "Previous Requests", icon: ShieldUser, path: "/owner-requests?type=previous", role: "admin" },
        { name: "Users", icon: Users, path: "/users", role: "admin" },
        { name: "Football Fields", icon: Volleyball, path: "/football-fields", role: ["admin", "owner", "player"] },
        { name: "My Favorite Fields", icon: Heart, path: "/my-favorite-fields", role: ["admin", "owner", "player"] },
        { name: "Reservations", icon: Calendar, path: "/reservations", role: ["admin", "owner", "player"] },
        { name: "Gift", icon: Gift, path: "/dashboard/gift", role: "owner" },
        { name: "Settings", icon: Settings, path: "/settings", role: ["admin", "owner", "player"] },
    ];

    useEffect(() => {
        if (window.innerWidth < 768) setIsOpen(false);
    }, []);

    return (
        <div
            className={`${isOpen ? "w-64" : "w-20"} h-screen flex flex-col transition-all duration-300 shadow-xl border-r border-green-700
    ${darkMode
                    ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700"
                    : "bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200"
                }`}
        >
            {/* Header */}
            <div className={`px-4 py-3 flex justify-between`}>
                {isOpen && <Button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`rounded-full shadow-md transition-all
                        ${darkMode
                            ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                            : "bg-gradient-to-br from-gray-800 to-gray-900 text-yellow-300"} 
                    hover:rotate-12`}
                >
                    {darkMode ? <Sun size={22} /> : <Moon size={22} />}
                </Button>}
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`rounded-full shadow-md transition-colors text-white ${darkMode
                        ? "bg-green-500 hover:bg-green-400"
                        : "bg-green-600 hover:bg-green-500"
                        }`}
                >
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </Button>
            </div>

            {/* Scrollable Menu + Footer */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Profile */}
                <div className="flex flex-col items-center mt-4 mb-6">
                    <img
                        src={user.profileImage || defaultProfile}
                        alt="Profile"
                        className="w-14 h-14 rounded-full shadow-lg border-2 border-green-500"
                    />
                    {isOpen && (
                        <h1 className={`font-bold mt-2 ${darkMode ? "text-green-400" : "text-green-700"}`}>
                            {user.firstName}
                        </h1>
                    )}
                </div>

                {/* Menu */}
                <nav className="flex-1 space-y-1">
                    {menus
                        .filter((menu) => {
                            if (Array.isArray(menu.role)) {
                                return menu.role.includes(user.role);
                            }
                            return menu.role === user.role;
                        })
                        .map((menu, index) => (
                            <NavLink
                                to={menu.path}
                                key={index}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${isActive
                                        ? darkMode
                                            ? "bg-gray-50 text-green-600 font-semibold"
                                            : "bg-green-600 text-white font-semibold shadow-md"
                                        : darkMode
                                            ? "text-gray-200 hover:bg-green-600 hover:text-white"
                                            : "text-gray-800 hover:bg-gray-300 hover:text-gray-800"
                                    }`
                                }
                            >
                                <menu.icon size={22} />
                                {isOpen && <span>{menu.name}</span>}
                            </NavLink>
                        ))}
                </nav>

                {/* Footer */}
                <div className="px-4 py-4 border-t border-green-700">
                    <Button
                        onClick={onLogout}
                        className={`flex items-center gap-3 w-full rounded-lg shadow-md bg-red-600 hover:bg-red-700 text-white`}
                    >
                        <LogOut size={20} />
                        {isOpen && <span>Logout</span>}
                    </Button>
                </div>
            </div>
        </div>
    );
}
