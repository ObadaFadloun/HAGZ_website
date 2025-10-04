import { useState } from "react";
import Lottie from "lottie-react";
import soccerAnimation from "../assets/soccer.json";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";

function AuthForm({ onAuth, initialMode = "login" }) {
    const [isSignUp, setIsSignUp] = useState(initialMode === "signup");
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    const toggleForm = () => {
        setIsSignUp((prev) => !prev);
        setError("");
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSignUp && form.password !== form.confirmPassword) {
            setError("Passwords do not match ❌");
            return;
        }

        try {
            const endpoint = isSignUp ? "/api/v1/auth/register" : "/api/v1/auth/login";

            const res = await fetch(`http://127.0.0.1:3000${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Something went wrong");

            setError("");
            onAuth(data);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-gray-50 to-gray-300 dark:from-gray-900 dark:to-gray-800">

            {/* Left Section - Branding */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="md:w-1/2 w-full flex flex-col justify-center items-center p-10"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <Lottie animationData={soccerAnimation} loop className="w-56 h-56 mb-6" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-800 mb-4"
                >
                    HAGZ
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="text-lg md:text-xl text-gray-700 dark:text-gray-300 text-center max-w-md leading-relaxed"
                >
                    Find, book, and play football with friends anytime, anywhere
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                >
                    <Button
                        className="mt-10 px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition cursor-pointer"
                        onClick={() => navigate("/homepage")}
                    >
                        ← Back to Homepage
                    </Button>
                </motion.div>
            </motion.div>

            {/* Divider Line */}
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
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.8 }}
                    className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-4/5 max-w-md"
                >
                    <h2 className="text-3xl font-bold text-center mb-6 text-green-700 dark:text-green-400">
                        {isSignUp ? "Create Account" : "Login"}
                    </h2>

                    {isSignUp && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="flex space-x-3"
                        >
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name*"
                                onChange={handleChange}
                                className="w-full mb-4 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-transparent focus:outline-none focus:border-green-600"
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last name*"
                                onChange={handleChange}
                                className="w-full mb-4 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-transparent focus:outline-none focus:border-green-600"
                                required
                            />
                        </motion.div>
                    )}

                    <motion.input
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1 }}
                        type="email"
                        name="email"
                        placeholder="Email address*"
                        onChange={handleChange}
                        className="block w-full mb-4 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-transparent focus:outline-none focus:border-green-600"
                        required
                    />
                    <motion.input
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1.1 }}
                        type="password"
                        name="password"
                        placeholder="Password*"
                        onChange={handleChange}
                        className="block w-full mb-4 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-transparent focus:outline-none focus:border-green-600"
                        required
                    />

                    {isSignUp && (
                        <motion.input
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 1.2 }}
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password*"
                            onChange={handleChange}
                            className="block w-full mb-4 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-transparent focus:outline-none focus:border-green-600"
                            required
                        />
                    )}

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="text-red-500 text-sm mb-4"
                        >
                            {error}
                        </motion.p>
                    )}

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 1.3 }}
                    >
                        <Button className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-3 px-4 rounded-xl shadow-md hover:scale-105 transition">
                            {isSignUp ? "Sign Up" : "Log In"}
                        </Button>
                    </motion.div>
                </motion.form>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1.5 }}
                    className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300"
                >
                    {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
                    <button
                        onClick={toggleForm}
                        className="text-green-600 dark:text-green-400 underline font-medium hover:text-green-800"
                    >
                        {isSignUp ? "Log In" : "Sign Up"}
                    </button>
                </motion.p>
            </motion.div>
        </div>
    );
}

export default AuthForm;
