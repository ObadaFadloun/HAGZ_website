import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Edit, Trash2, LayoutGrid, Table } from "lucide-react";
import Lottie from "lottie-react";
import loadingLottie from "../../assets/loading.json";
import empty from "../../assets/empty.json";
import api from "../../utils/api";
import ReservationCard from "./components/ReservationCard";
import EditReservationModal from "./components/EditReservationModal";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import ReservationsTable from "./components/ReservationsTable";
import AlertModal from "../../components/AlertModal";

export default function MyReservations({ user, darkMode, setDarkMode }) {
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState([]);
    const [editModal, setEditModal] = useState({ show: false, reservation: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState("table");
    const userRole = user.role;
    const [showMyReservations, setShowMyReservations] = useState(false);

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

    // ✅ Simple notification function (only OK button)
    const showNotification = (message, title = "Notification") => {
        setAlert({ show: true, message, onConfirm: null, title });
    };

    // ✅ Persist dark mode preference
    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    // ✅ Fetch reservations
    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            try {
                const res = await api.get("/reservations", { user });
                setReservations(res.data.reservations || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, [userRole]);

    // ✅ Filter
    const filteredReservations = showMyReservations
        ? reservations.filter((r) => r.player?._id === user._id)
        : reservations;

    // ✅ Delete
    const handleDelete = async (id) => {
        showAlert(
            "Are you sure you want to delete this reservation?",
            async () => {
                try {
                    await api.delete(`/reservations/${id}`);
                    setReservations((prev) => prev.filter((r) => r._id !== id));
                    showNotification("Reservation deleted successfully!");
                } catch (err) {
                    showNotification(err.response?.data?.message || "Failed to delete reservation");
                }
            },
            "Confirm Deletion"
        );
    };

    // ✅ Reject
    const handleReject = async (id) => {
        showAlert(
            "Are you sure you want to reject this reservation?",
            async () => {
                try {
                    const res = await api.patch(`/reservations/${id}/cancel`);
                    const updated = res.data.reservation || res.data.data;

                    setReservations((prev) =>
                        prev.map((r) => (r._id === id ? updated : r))
                    );
                    showNotification("Reservation rejected successfully!"); // ✅ Use showNotification
                } catch (err) {
                    showNotification(err.response?.data?.message || "Failed to reject reservation"); // ✅ Use showNotification
                }
            },
            "Confirm Rejection"
        );
    };

    // ✅ Update
    const handleUpdatedReservation = (updated) => {
        setReservations((prev) =>
            prev.map((r) => (r._id === updated._id ? updated : r))
        );
    };

    // ✅ Pagination
    const reservationsPerPage = 10;
    const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);
    const currentReservations = filteredReservations.slice(
        (currentPage - 1) * reservationsPerPage,
        currentPage * reservationsPerPage
    );

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    };

    const toggleTheme = () => setDarkMode((prev) => !prev);
    const toggleViewMode = () =>
        setViewMode((prev) => (prev === "table" ? "card" : "table"));

    // ✅ Loading state
    if (loading) {
        return (
            <div
                className={`fixed inset-0 flex flex-col items-center justify-center ${darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-700"
                    }`}
            >
                <Lottie animationData={loadingLottie} loop className="w-40 h-40 mb-6" />
                <p>Loading reservations...</p>
            </div>
        );
    }

    // ✅ Empty state
    if (!loading && filteredReservations.length === 0) {
        return (
            <div
                className={`fixed inset-0 flex flex-col items-center justify-center transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-700"
                    }`}
            >
                <div
                    className={`absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 border-b ${darkMode
                        ? "border-gray-700 bg-gray-800"
                        : "border-gray-200 bg-white"
                        }`}
                >
                    <h2 className="text-2xl font-bold">Reservations</h2>
                    <div className="flex gap-3">
                        <Button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full ${darkMode
                                ? "bg-gray-700 text-gray-100"
                                : "bg-gray-300 text-gray-900"
                                }`}
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </Button>
                        <Button
                            onClick={() => window.history.back()}
                            className={`px-4 py-2 rounded-lg ${darkMode
                                ? "bg-gray-700 text-gray-100"
                                : "bg-gray-300 text-gray-900"
                                }`}
                        >
                            ← Back
                        </Button>
                    </div>
                </div>

                <Lottie animationData={empty} loop className="w-52 h-52 opacity-90" />
                <p className="mt-4 text-gray-400">No reservations found.</p>
                <Button
                    className="mt-6 text-white bg-gradient-to-r from-green-600 to-green-800 font-bold hover:shadow-xl"
                    onClick={() => window.location.reload()}
                >
                    Refresh Page
                </Button>
            </div>
        );
    }

    // ✅ Main UI
    return (
        <div
            className={`min-h-screen p-6 transition-all duration-500 ${darkMode ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-800"
                }`}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Reservations</h2>
                <div className="flex gap-3">
                    <Button
                        onClick={toggleViewMode}
                        className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-300 text-gray-900"
                            }`}
                    >
                        {viewMode === "table" ? <LayoutGrid size={18} /> : <Table size={18} />}
                    </Button>
                    <Button
                        onClick={toggleTheme}
                        className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-300 text-gray-900"
                            }`}
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </Button>
                    <Button
                        onClick={() => window.history.back()}
                        className={`px-4 py-2 rounded-lg ${darkMode
                            ? "bg-gray-700 text-gray-100"
                            : "bg-gray-300 text-gray-900"
                            }`}
                    >
                        ← Back
                    </Button>
                </div>
            </div>

            {userRole !== "player" && (
                <label className="flex justify-end items-center gap-2 mb-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showMyReservations}
                        onChange={(e) => setShowMyReservations(e.target.checked)}
                        className="w-4 h-4 accent-green-600 cursor-pointer"
                    />
                    <span>only my reservations</span>
                </label>
            )}

            {/* Table View */}
            {viewMode === "table" && (
                <ReservationsTable
                    reservations={currentReservations}
                    handleReject={handleReject}
                    handleDelete={handleDelete}
                    handleUpdatedReservation={handleUpdatedReservation}
                    darkMode={darkMode}
                    userRole={userRole}
                    user={user}
                />
            )}

            {/* Card View */}
            {viewMode === "card" && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentReservations.map((r) => (
                        <ReservationCard
                            key={r._id}
                            reservation={r}
                            userRole={userRole}
                            onEdit={() => setEditModal({ show: true, reservation: r })}
                            onDelete={handleDelete}
                            onReject={handleReject}
                            darkMode={darkMode}
                            user={user}
                        />
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editModal.show && (
                <EditReservationModal
                    user={user}
                    slots={reservations}
                    show={editModal.show}
                    reservation={editModal.reservation}
                    onClose={() => setEditModal({ show: false, reservation: null })}
                    onUpdated={handleUpdatedReservation}
                    darkMode={darkMode}
                />
            )}

            <div className="flex justify-center mt-10 mb-10">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* ✅ Alert Modal */}
            <AlertModal
                show={alert.show}
                message={alert.message}
                title={alert.title}
                onClose={closeAlert}
                onConfirm={alert.onConfirm}
                darkMode={darkMode}
            />
        </div>
    );
}