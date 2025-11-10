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

export default function MyReservations({ user, darkMode, setDarkMode }) {
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState([]);
    const [editModal, setEditModal] = useState({ show: false, reservation: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState("table");
    const userRole = user.role;
    const [showMyReservations, setShowMyReservations] = useState(false);

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
        if (!window.confirm("Are you sure you want to delete this reservation?")) return;
        try {
            await api.delete(`/reservations/${id}`);
            setReservations((prev) => prev.filter((r) => r._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete reservation");
        }
    };

    // ✅ Reject
    const handleReject = async (id) => {
        if (!window.confirm("Are you sure you want to reject this reservation?")) return;
        try {
            const res = await api.patch(`/reservations/${id}/cancel`);
            const updated = res.data.reservation || res.data.data;

            // Update status in place (don’t hide it)
            setReservations((prev) =>
                prev.map((r) => (r._id === id ? updated : r))
            );
        } catch (err) {
            alert(err.response?.data?.message || "Failed to reject reservation");
        }
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

            {/* Table View */}
            {viewMode === "table" && (
                <div className="overflow-x-auto">
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
                    <motion.table
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className={`min-w-full border rounded-xl ${darkMode ? "border-gray-700" : "border-gray-200"
                            }`}
                    >
                        <thead
                            className={`${darkMode
                                ? "bg-gray-900 text-gray-200"
                                : "bg-gray-200 text-gray-800"
                                } text-sm uppercase`}
                        >
                            <tr>
                                <th className="p-3 text-left">Field</th>
                                <th className="p-3 text-left">Owner</th>
                                <th className="p-3 text-left">Player</th>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Slot</th>
                                <th className="p-3 text-left">Price</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {currentReservations.map((r) => {
                                    if (!r) return null; // prevent crashes
                                    const now = new Date();
                                    const dateOnly = r.date.split("T")[0];
                                    const start = new Date(`${dateOnly}T${r.startTime}`);

                                    const canEdit =
                                        userRole === "admin" ||
                                        userRole === "owner" ||
                                        (userRole === "player" && now < start);
                                    return (
                                        <motion.tr
                                            key={r._id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className={`border-b ${darkMode
                                                ? "border-gray-600 hover:bg-gray-800 bg-gray-700"
                                                : "border-gray-100 hover:bg-gray-100"
                                                }`}
                                        >
                                            <td className="p-3">{r.field?.name || "N/A"}</td>
                                            <td className="p-3">{r.owner?.firstName || "N/A"}</td>
                                            <td className="p-3">{r.player?.firstName || "N/A"}</td>
                                            <td className="p-3">
                                                {r.date
                                                    ? new Date(r.date).toLocaleDateString()
                                                    : "Unknown"}
                                            </td>
                                            <td className="p-3">
                                                {r.startTime} - {r.endTime}
                                            </td>
                                            <td className="p-3">{r.totalPrice || 0} EGP</td>
                                            <td className="p-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${r.status === "active"
                                                        ? darkMode
                                                            ? "bg-green-900 text-green-200"
                                                            : "bg-green-100 text-green-700"
                                                        : r.status === "completed"
                                                            ? darkMode
                                                                ? "bg-yellow-900 text-yellow-200"
                                                                : "bg-yellow-100 text-yellow-700"
                                                            : darkMode
                                                                ? "bg-red-900 text-red-200"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="p-3 flex gap-2">
                                                {canEdit && r.status === "active" && (
                                                    <>
                                                        <Button
                                                            onClick={() =>
                                                                setEditModal({ show: true, reservation: r })
                                                            }
                                                            className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                                                        >
                                                            <Edit size={14} /> Edit
                                                        </Button>
                                                        <Button
                                                            onClick={() =>
                                                                r.player._id === user._id
                                                                    ? handleDelete(r._id)
                                                                    : handleReject(r._id)
                                                            }
                                                            className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                                        >
                                                            <Trash2 size={14} />{" "}
                                                            {r.player._id === user._id ? "Delete" : "Reject"}
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </motion.table>
                </div>
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
                />
            )}

            <div className="flex justify-center mt-10 mb-10">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
