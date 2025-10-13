import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import loadingLottie from "../assets/loading.json";
import empty from "../assets/empty.json"
import { motion } from "framer-motion";
import Typewriter from "../components/Typewriter";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import Button from "../components/Button";
import api from "../utils/api";

export default function OwnerRequests({ darkMode, setDarkMode }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type") || "new";

    // Fetch all requests on page load
    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get(`/owner-requests?type=${type}`);
            setRequests(res.data.data.requests);
        } catch (err) {
            console.error("Error fetching requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await api.patch(`/owner-requests/${id}/${action}`);
            fetchRequests(); // Refresh after approval/rejection
        } catch (err) {
            console.error("Error updating request:", err);
        }
    };

    if (loading) {
        return (
            <motion.div
                className={`min-h-screen w-screen flex flex-col justify-center items-center ${darkMode && "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-50"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <Lottie animationData={loadingLottie} loop className="w-56 h-56 mb-6" />
                <p className="text-lg animate-pulse">Loading requests...</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={`min-h-screen p-8 transition-all duration-300 ${darkMode
                ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white"
                : "bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 text-gray-900"
                }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Header Actions */}
            <motion.div
                className="flex justify-between items-center mb-8"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        onClick={() => navigate("/dashboard")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md font-semibold transition-all duration-300 cursor-pointer ${darkMode
                            ? "bg-green-600 hover:bg-green-500 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </Button>
                </motion.div>

                <motion.div whileHover={{ rotate: 20 }} whileTap={{ scale: 0.9 }}>
                    <Button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`p-2 rounded-full shadow-md transition-all duration-300 cursor-pointer ${darkMode
                            ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                            : "bg-gradient-to-br from-gray-800 to-gray-900 text-yellow-300"
                            }`}
                    >
                        {darkMode ? <Sun size={22} /> : <Moon size={22} />}
                    </Button>
                </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
                className="text-3xl font-bold mb-6 text-green-600"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                Owner Requests
            </motion.h1>

            {/* Requests List */}
            {requests.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`flex flex-col items-center justify-center py-8 px-6 rounded-2xl shadow-lg border transition-all duration-300
      ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}
    `}
                >
                    <Lottie
                        animationData={empty}
                        loop
                        className="w-72 h-72 mb-8 opacity-90"
                    />

                    <motion.h2
                        className={`text-2xl font-semibold mb-2 text-center ${darkMode ? "text-white" : "text-gray-800"
                            }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        No Requests Found
                    </motion.h2>

                    <motion.p
                        className={`text-center max-w-md text-base ${darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Typewriter
                            text="It looks like there are no pending requests right now. Once players send requests to become owners, you’ll see them listed here."
                            speed={30}
                        />
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8"
                    >
                        <Button onClick={() => window.location.reload()}>
                            Refresh Page
                        </Button>
                    </motion.div>
                </motion.div>
            ) : (
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {requests.map((req, i) => (
                        <motion.div
                            key={req._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`p-5 rounded-xl shadow-lg flex justify-between items-center transition-all duration-300 ${darkMode ? "bg-gray-800" : "bg-white"
                                }`}
                        >
                            <div>
                                <p className="text-lg font-semibold text-green-600">
                                    {req.user?.firstName || "Unknown User"}
                                </p>
                                <p className="text-sm opacity-75">{req.user?.email}</p>
                                <p
                                    className={`text-xs mt-1 font-medium ${req.status === "pending"
                                        ? "text-yellow-500"
                                        : req.status === "approved"
                                            ? "text-green-500"
                                            : "text-red-500"
                                        }`}
                                >
                                    {req.status.toUpperCase()}
                                </p>
                            </div>

                            <div className="space-x-3">
                                {req.status === "pending" && (
                                    <motion.div className="flex gap-3">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                onClick={() => handleAction(req._id, "approve")}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
                                            >
                                                Approve
                                            </Button>
                                        </motion.div>

                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                onClick={() => handleAction(req._id, "reject")}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md"
                                            >
                                                Reject
                                            </Button>
                                        </motion.div>
                                    </motion.div >
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}
