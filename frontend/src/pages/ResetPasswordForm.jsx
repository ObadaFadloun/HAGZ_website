import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import soccerAnimation from "../assets/soccer.json";
import Button from "../components/Button";
import api from "../utils/api";

export default function ResetPasswordForm({ darkMode, setDarkMode }) {
    const { token } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match ❌");
            return;
        }

        try {
            setLoading(true);
            await api.patch(`/auth/resetPassword/${token}`, form);
            setSuccess(true);
            setError("");
            setTimeout(() => navigate("/auth"), 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`min-h-screen flex flex-col md:flex-row items-center justify-center transition-colors duration-500
        ${darkMode
                    ? "bg-gradient-to-br from-gray-950 to-gray-900 text-gray-200"
                    : "bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800"}`}
        >
            {/* Left Section */}
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
                    className="text-lg md:text-xl text-center max-w-md leading-relaxed"
                >
                    Reset your password and get back to booking your next match ⚽
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                >
                    <Button
                        className="mt-10 px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition cursor-pointer"
                        onClick={() => navigate("/auth")}
                    >
                        ← Back to Login
                    </Button>
                </motion.div>
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
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.8 }}
                    className={`p-8 rounded-2xl shadow-2xl w-4/5 max-w-md transition-colors duration-500
            ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}
                >
                    <h2 className={`text-3xl font-bold text-center mb-6 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                        Reset Password
                    </h2>


                    <input
                        type="password"
                        name="password"
                        placeholder="New Password*"
                        onChange={handleChange}
                        className={`block w-full mb-4 p-3 rounded-xl border focus:outline-none focus:border-green-600 transition
                            ${darkMode ? "border-gray-700 bg-gray-800 text-gray-100" : "border-gray-300 bg-gray-100 text-gray-900"}`}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password*"
                        onChange={handleChange}
                        className={`block w-full mb-4 p-3 rounded-xl border focus:outline-none focus:border-green-600 transition
                            ${darkMode ? "border-gray-700 bg-gray-800 text-gray-100" : "border-gray-300 bg-gray-100 text-gray-900"}`}
                        required
                    />
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-sm mb-4">✅ Password reset successful!</p>}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-3 px-4 rounded-xl shadow-md hover:scale-105 transition cursor-pointer"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </motion.form>
            </motion.div>
        </div>
    );
}
