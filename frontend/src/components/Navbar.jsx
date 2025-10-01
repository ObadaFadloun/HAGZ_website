// src/components/Navbar.jsx
import { Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function Navbar({ user, onLogout, darkMode, setDarkMode }) {
    const navigate = useNavigate();

    const isAuthPage = location.pathname === "/auth";

    return (
        <header className="flex justify-between items-center px-6 py-4 shadow-md bg-white dark:bg-green-600 text-gray-50">
            {/* Logo */}
            <h1
                onClick={() => navigate("/homepage")}
                className="text-2xl font-bold cursor-pointer text-gray-200 text-gray-50"
            >
                HAGZ
            </h1>

            {/* Nav links */}
            <nav className="hidden md:flex space-x-6">
                <Button onClick={() => navigate("/homepage")} className="hover:text-green-900 cursor-pointer">
                    Home
                </Button>
                <Button onClick={() => navigate("/fields")} className="hover:text-green-900 cursor-pointer">
                    Fields
                </Button>
                <Button onClick={() => navigate("/teams")} className="hover:text-green-900 cursor-pointer">
                    Teams
                </Button>
                <Button onClick={() => navigate("/offers")} className="hover:text-green-900 cursor-pointer">
                    Offers
                </Button>
                <Button onClick={() => navigate("/about")} className="hover:text-green-900 cursor-pointer">
                    About
                </Button>
                <Button onClick={() => navigate("/contact")} className="hover:text-green-900 cursor-pointer">
                    Contact
                </Button>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
                {!user && !isAuthPage && (
                    <>
                        <Button
                            onClick={() => navigate("/auth?mode=login")}
                            className="px-3 py-2 rounded-lg text-sm bg-gray-200 text-black hover:bg-green-800 hover:text-white cursor-pointer"
                        >
                            Login
                        </Button>

                        <Button
                            onClick={() => navigate("/auth?mode=signup")}
                            className="px-3 py-2 rounded-lg text-sm bg-gray-200 text-black hover:bg-gray-600 hover:text-white cursor-pointer"
                        >
                            Signup
                        </Button>
                    </>
                )}

                {user && (
                    <Button
                        onClick={onLogout}
                        className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-100 text-black cursor-pointer"
                    >
                        Logout
                    </Button>
                )}

                <Button onClick={() => setDarkMode(!darkMode)} className="p-2 cursor-pointer">
                    {darkMode ? <Sun /> : <Moon />}
                </Button>
            </div>
        </header>
    );
}
