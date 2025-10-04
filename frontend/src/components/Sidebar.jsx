import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import defaultProfile from '../assets/profile-imge.png'

import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Gift,
    ShieldAlert
} from "lucide-react";

export default function Sidebar({ user, onLogout, darkMode }) {
    const [isOpen, setIsOpen] = useState(true);

    const menus = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { name: "Owner Reqests", icon: ShieldAlert, path: "/dashboard/ownerReqests" },
        { name: "Bookings", icon: Calendar, path: "/dashboard/bookings" },
        { name: "Users", icon: Users, path: "/dashboard/users" },
        { name: "Gift", icon: Gift, path: "/dashboard/gift" },
        { name: "Settings", icon: Settings, path: "/dashboard/settings" },
    ];

    useEffect(() => {
        if (window.innerWidth < 768) setIsOpen(false);
    }, []);

    return (
        <div
            className={`${isOpen ? "w-64" : "w-20"} bg-gray-800 text-white h-screen flex flex-col transition-all duration-300 shadow-xl`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-full bg-green-700 hover:bg-green-600"
                >
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            {/* Scrollable Menu + Footer */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Profile */}
                <div className="flex flex-col items-center mt-4 mb-6">
                    <img
                        src={user.profileImage || defaultProfile}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                    />
                    {isOpen && < h1 className="font-bold text-green-600 mt-2">{user.firstName}</h1>}
                </div>

                {/* Menu */}
                <nav className="flex-1 mt-6">
                    {menus.map((menu, index) => (
                        <NavLink
                            to={menu.path}
                            key={index}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 my-2 rounded-lg transition-all duration-200 ${isActive
                                    ? "bg-white text-green-700 font-semibold"
                                    : "hover:bg-green-700"
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
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-red-700 transition cursor-pointer"
                    >
                        <LogOut size={20} />
                        {isOpen && <span>Logout</span>}
                    </button>
                </div>
            </div>
        </div >

    );
}
