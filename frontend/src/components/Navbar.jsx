import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function Navbar({ darkMode, setDarkMode }) {
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-3 shadow-lg bg-gradient-to-r from-green-600 to-green-800 text-white z-50">
            {/* Logo */}
            <h1
                onClick={() => navigate("/homepage")}
                className="text-2xl font-extrabold cursor-pointer tracking-wide hover:text-green-900 transform transition duration-300 ease-in-out hover:scale-110"
            >
                HAGZ
            </h1>

            {/* Nav links */}
            <nav className="hidden md:flex space-x-6">
                <Button
                    onClick={() => navigate("/homepage")}
                >
                    Home
                </Button>
                <Button
                    onClick={() => navigate("/fields")}
                >
                    Fields
                </Button>
                <Button
                    onClick={() => navigate("/teams")}
                >
                    Teams
                </Button>
                <Button
                    onClick={() => navigate("/offers")}
                >
                    Offers
                </Button>
                <Button
                    onClick={() => navigate("/about")}
                >
                    About
                </Button>
                <Button
                    onClick={() => navigate("/contact")}
                >
                    Contact
                </Button>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
                <Button
                    onClick={() => navigate("/auth")}
                    className="w-20 rounded-lg text-green-700 bg-gradient-to-r from-gray-200 to-gray-400"
                >
                    Login
                </Button>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <Button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg 
                        ${darkMode
                                ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                                : "bg-gradient-to-br from-gray-800 to-gray-900 text-yellow-300"} 
                        hover:scale-110 hover:rotate-12`}
                    >
                        {darkMode ? <Sun size={22} /> : <Moon size={22} />}
                    </Button>
                </motion.div>
            </div>
        </header>
    );
}
