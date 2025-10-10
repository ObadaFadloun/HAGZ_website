import { useState } from "react";
import Lottie from "lottie-react";
import soccerAnimation from "../assets/soccer.json";
import { Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/Button";
import api from "../utils/api";

function AuthForm({ onAuth, initialMode = "login", darkMode, setDarkMode }) {
    const [isSignUp, setIsSignUp] = useState(initialMode === "signup");
    const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const toggleForm = () => {
        setIsSignUp((prev) => !prev);
        setError("");
        setSuccess("");
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            setLoading(true);

            // Forgot password mode
            if (forgotPasswordMode) {
                try {
                    await api.post("/auth/forgotPassword", { email: form.email });
                    setSuccess("✅ Password reset link sent to your email. Please check your inbox.");

                    // Navigate to Reset Password form after 2 seconds
                    setTimeout(() => navigate("/reset-password"), 5000);
                } catch (err) {
                    setError(err.response?.data?.message || "Failed to send reset link.");
                } finally {
                    setLoading(false);
                }
                return;
            }

            // Register or login
            const endpoint = isSignUp ? "/auth/register" : "/auth/login";
            const res = await api.post(endpoint, form);

            if (res.data.status !== "success") throw new Error("Something went wrong");

            onAuth(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`min-h-screen flex flex-col md:flex-row items-center justify-center transition-colors duration-500
    ${darkMode
                    ? "bg-gradient-to-br from-gray-950 to-gray-900 text-gray-200"
                    : "bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800"
                }`}
        >
            {/* Dark Mode Toggle */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute top-6 right-6"
            >
                <Button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg 
        transition-all duration-500 
        ${darkMode
                            ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                            : "bg-gradient-to-br from-gray-800 to-gray-900 text-yellow-300"
                        } 
        hover:scale-110 hover:rotate-12`}
                >
                    {darkMode ? <Sun size={22} /> : <Moon size={22} />}
                </Button>
            </motion.div>

            {/* Left Section */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="md:w-1/2 w-full flex flex-col justify-center items-center p-10"
            >
                <Lottie animationData={soccerAnimation} loop className="w-56 h-56 mb-6" />

                <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-800 mb-4">
                    HAGZ
                </h1>

                <p className="text-lg md:text-xl text-center max-w-md leading-relaxed">
                    Find, book, and play football with friends anytime, anywhere.
                </p>

                <Button
                    className="mt-10 px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition cursor-pointer"
                    onClick={() => navigate("/homepage")}
                >
                    ← Back to Homepage
                </Button>
            </motion.div>

            {/* Divider */}
            <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="hidden md:block h-80 w-px bg-gradient-to-b from-green-500 to-green-800 mx-8 origin-top"
            ></motion.div>

            {/* Right Section - Form */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="md:w-1/2 w-full flex flex-col items-center"
            >
                <AnimatePresence mode="wait">
                    <motion.form
                        key={forgotPasswordMode ? "forgot" : isSignUp ? "signup" : "login"}
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.6 }}
                        className={`p-8 rounded-2xl shadow-2xl w-4/5 max-w-md transition-colors duration-500
            ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
                            }`}
                    >
                        <h2
                            className={`text-3xl font-bold text-center mb-6 ${darkMode ? "text-green-400" : "text-green-600"
                                }`}
                        >
                            {forgotPasswordMode
                                ? "Reset Password"
                                : isSignUp
                                    ? "Create Account"
                                    : "Login"}
                        </h2>

                        {/* Forgot password form */}
                        {forgotPasswordMode ? (
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email*"
                                onChange={handleChange}
                                className={`block w-full mb-4 p-3 rounded-xl border focus:outline-none focus:border-green-600 transition
                ${darkMode
                                        ? "border-gray-700 bg-gray-800 text-gray-100"
                                        : "border-gray-300 bg-gray-100 text-gray-900"
                                    }`}
                                required
                            />
                        ) : (
                            <>
                                {isSignUp && (
                                    <div className="flex space-x-3">
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="First name*"
                                            onChange={handleChange}
                                            className={`w-full mb-4 p-3 rounded-xl border focus:outline-none focus:border-green-600 transition
                    ${darkMode
                                                    ? "border-gray-700 bg-gray-800 text-gray-100"
                                                    : "border-gray-300 bg-gray-100 text-gray-900"
                                                }`}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last name*"
                                            onChange={handleChange}
                                            className={`w-full mb-4 p-3 rounded-xl border focus:outline-none focus:border-green-600 transition
                    ${darkMode
                                                    ? "border-gray-700 bg-gray-800 text-gray-100"
                                                    : "border-gray-300 bg-gray-100 text-gray-900"
                                                }`}
                                            required
                                        />
                                    </div>
                                )}

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address*"
                                    onChange={handleChange}
                                    className={`block w-full mb-4 p-3 rounded-xl border focus:outline-none focus:border-green-600 transition
                ${darkMode
                                            ? "border-gray-700 bg-gray-800 text-gray-100"
                                            : "border-gray-300 bg-gray-100 text-gray-900"
                                        }`}
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password*"
                                    onChange={handleChange}
                                    className={`block w-full mb-4 p-3 rounded-xl border focus:outline-none focus:border-green-600 transition
                ${darkMode
                                            ? "border-gray-700 bg-gray-800 text-gray-100"
                                            : "border-gray-300 bg-gray-100 text-gray-900"
                                        }`}
                                    required
                                />

                                {isSignUp && (
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password*"
                                        onChange={handleChange}
                                        className={`block w-full mb-4 p-3 rounded-xl border focus:outline-none focus:border-green-600 transition
                    ${darkMode
                                                ? "border-gray-700 bg-gray-800 text-gray-100"
                                                : "border-gray-300 bg-gray-100 text-gray-900"
                                            }`}
                                        required
                                    />
                                )}
                            </>
                        )}

                        {/* Messages */}
                        <AnimatePresence mode="wait">
                            {(error || success) && (
                                <motion.p
                                    key={error || success}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4 }}
                                    className={`text-sm mb-4 text-center ${success ? "text-green-500" : "text-red-500"}`}
                                >
                                    {success || error}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <Button
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-xl shadow-md text-white transition cursor-pointer ${loading
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-green-600 to-green-800 hover:scale-105"
                                }`}
                        >
                            {loading
                                ? "Loading..."
                                : forgotPasswordMode
                                    ? "Send Reset Link"
                                    : isSignUp
                                        ? "Sign Up"
                                        : "Log In"}
                        </Button>
                    </motion.form>
                </AnimatePresence>

                {/* Forgot Password / Toggle Links */}
                <AnimatePresence mode="wait">
                    {!forgotPasswordMode && !isSignUp && (
                        <motion.p
                            key="forgot"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="mt-4 text-center text-sm"
                        >
                            <button
                                onClick={() => setForgotPasswordMode(true)}
                                className={`underline font-medium hover:text-green-800 cursor-pointer ${darkMode ? "text-green-400" : "text-green-700"
                                    }`}
                            >
                                Forgot password?
                            </button>
                        </motion.p>
                    )}

                    {forgotPasswordMode && (
                        <motion.p
                            key="back"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="mt-4 text-center text-sm"
                        >
                            <button
                                onClick={() => setForgotPasswordMode(false)}
                                className={`underline font-medium hover:text-green-800 cursor-pointer ${darkMode ? "text-green-400" : "text-green-700"
                                    }`}
                            >
                                ← Back to login
                            </button>
                        </motion.p>
                    )}

                    {!forgotPasswordMode && (
                        <motion.p
                            key="switch"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="mt-4 text-center text-sm"
                        >
                            {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
                            <button
                                onClick={toggleForm}
                                className={`underline font-medium hover:text-green-800 cursor-pointer ${darkMode ? "text-green-400" : "text-green-700"
                                    }`}
                            >
                                {isSignUp ? "Log In" : "Sign Up"}
                            </button>
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default AuthForm;
