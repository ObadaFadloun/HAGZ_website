import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Button from "./Button";

export default function Sidebar({user, onLogout, darkMode, setDarkMode }) {
    const [isOpen, setIsOpen] = useState(true);

    const menus = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { name: "Bookings", icon: Calendar, path: "/dashboard/bookings" },
        { name: "Users", icon: Users, path: "/dashboard/users" },
        { name: "Settings", icon: Settings, path: "/dashboard/settings" },
    ];

    return (
        <div
            className={`${isOpen ? "w-64" : "w-20"
                } bg-gradient-to-b from-green-600 to-green-800 text-white h-screen flex flex-col transition-all duration-300 shadow-xl`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <h1
                    className={`font-bold text-xl transition-all duration-300 ${!isOpen && "opacity-0 hidden"
                        }`}
                >
                    HAGZ
                </h1>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-full bg-green-700 hover:bg-green-600"
                >
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            {/* Menu Links */}
            <nav className="flex-1 mt-6">
                {menus.map((menu, index) => (
                    <NavLink
                        to={menu.path}
                        key={index}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3 my-2 mx-2 rounded-lg transition-all duration-200 ${isActive
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
                <Button  onClick={onLogout} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-green-700 transition">
                    <LogOut size={20} />
                    {isOpen && <span>Logout</span>}
                </Button>
            </div>
        </div>
    );
}
