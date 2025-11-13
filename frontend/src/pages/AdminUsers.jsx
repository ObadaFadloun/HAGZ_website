import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sun, Moon, Users } from "lucide-react";
import api from "../utils/api";
import Lottie from "lottie-react";
import loadingLottie from "../assets/loading.json";
import noUsers from "../assets/EmptyState.json";
import Button from "../components/Button";
import Pagination from "../components/Pagination";
import AlertModal from "../components/AlertModal";

export default function AdminUsers({ darkMode, setDarkMode }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const usersPerPage = 5;

    // ✅ Alert state
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        onConfirm: null,
        title: "Notification"
    });

    const showAlert = (message, onConfirm = null, title = "Notification") => {
        setAlert({ show: true, message, onConfirm, title });
    };

    const closeAlert = () => {
        setAlert({ show: false, message: "", onConfirm: null, title: "Notification" });
    };

    const showNotification = (message, title = "Notification") => {
        setAlert({ show: true, message, onConfirm: null, title });
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users");
                setUsers(res.data.data.users);
            } catch (err) {
                console.error(err);
                showNotification("Failed to load users", "Error");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Filter non-admin users
    const filteredUsers = useMemo(() => users.filter((user) => user.role !== "admin"), [users]);

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const indexOfLast = currentPage * usersPerPage;
    const indexOfFirst = indexOfLast - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to table
    };

    const handleDelete = async (userId) => {
        showAlert(
            "Are you sure you want to delete this user?",
            async () => {
                try {
                    await api.delete(`/users/${userId}`);
                    setUsers((prev) => prev.filter((u) => u._id !== userId));
                    showNotification("User deleted successfully ✅", "Success");
                } catch (err) {
                    console.error(err);
                    showNotification("Failed to delete user ❌", "Error");
                }
            },
            "Confirm User Deletion"
        );
    };

    if (loading)
        return (
            <div className={`flex justify-center items-center h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
                <Lottie animationData={loadingLottie} loop className="w-48 h-48" />
            </div>
        );

    return (
        <main className={`min-h-screen p-8 transition-all duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
            {/* Header */}
            <motion.div
                className="flex justify-between items-center mb-8"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 px-4 rounded-full shadow-md bg-gradient-to-r from-green-600 to-green-700 text-white"
                >
                    <ArrowLeft size={18} /> Back to Dashboard
                </Button>

                <Button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`rounded-full shadow-md transition-all ${darkMode ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white" : "bg-gradient-to-br from-gray-800 to-gray-900 text-yellow-300"}`}
                >
                    {darkMode ? <Sun size={22} /> : <Moon size={22} />}
                </Button>
            </motion.div>

            {/* Title */}
            <div className="flex items-center gap-3 mb-8 text-green-600">
                <Users size={32} />
                <h1 className="text-3xl font-bold">All Users</h1>
            </div>

            {/* No Users */}
            {currentUsers.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`flex flex-col text-center items-center py-20 rounded-xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}
                >
                    <Lottie animationData={noUsers} loop className="w-48 h-48" />
                    <p className="text-lg font-bold opacity-70">No users found yet.</p>
                    <Button
                        className="mt-6 text-white bg-gradient-to-r from-green-600 to-green-800 font-bold hover:shadow-xl"
                        onClick={() => window.location.reload()}
                    >
                        Refresh Page
                    </Button>
                </motion.div>
            ) : (
                <>
                    {/* Users Table */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto rounded-2xl shadow-md">
                        <table className={`w-full border-collapse ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white"}`}>
                            <thead>
                                <tr className={`text-left text-sm uppercase ${darkMode ? "bg-gray-700 text-green-400" : "bg-gray-200 text-green-600"}`}>
                                    <th className="p-4">#</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Joined</th>
                                    <th className="p-4">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user, i) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`border-b ${darkMode ? "border-gray-700 hover:bg-gray-600" : "border-gray-200 hover:bg-gray-100"}`}
                                    >
                                        <td className="p-4 font-semibold">{indexOfFirst + i + 1}</td>
                                        <td className="p-4">{`${user.firstName} ${user.lastName}`}</td>
                                        <td className="p-4">{user.email}</td>
                                        <td className={`p-4 capitalize font-bold ${user.role === "owner" ? (darkMode ? "text-yellow-400" : "text-yellow-600") : (darkMode ? "text-green-400" : "text-green-600")}`}>
                                            {user.role}
                                        </td>
                                        <td className="p-4">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                                        </td>
                                        <td>
                                            <Button
                                                onClick={() => handleDelete(user._id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                                            >
                                                Block
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-6">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                </>
            )}

            {/* ✅ Alert Modal */}
            <AlertModal
                show={alert.show}
                message={alert.message}
                title={alert.title}
                onClose={closeAlert}
                onConfirm={alert.onConfirm}
                darkMode={darkMode}
            />
        </main>
    );
}