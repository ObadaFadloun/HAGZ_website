import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Edit, Trash2, Calendar, Clock, MapPin, User } from "lucide-react";
import api from "../../../utils/api";
import ReservationCard from "./ReservationCard";
import EditReservationModal from "./EditReservationModal";

export default function ReservationsTable({ userRole }) {
    const [reservations, setReservations] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [editModal, setEditModal] = useState({ show: false, reservation: null });

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                let endpoint = "/reservations";
                if (userRole === "player") endpoint = "/reservations/my";
                else if (userRole === "owner") endpoint = "/reservations/owner";

                const res = await api.get(endpoint);
                setReservations(res.data.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchReservations();
    }, [userRole]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this reservation?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/reservations/${id}`);
            setReservations((prev) => prev.filter((r) => r._id !== id));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to delete reservation");
        }
    };

    const handleUpdatedReservation = (updated) => {
        setReservations((prev) =>
            prev.map((r) => (r._id === updated._id ? updated : r))
        );
    };

    const toggleTheme = () => setDarkMode(!darkMode);

    return (
        <div className={`${darkMode ? "dark bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"} min-h-screen p-6 transition-all`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Reservations</h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="px-3 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:opacity-80"
                    >
                        ← Back
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-gray-300 dark:bg-gray-700"
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </div>

            {/* ✅ Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <motion.table
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="min-w-full border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                >
                    <thead className="bg-gray-200 dark:bg-gray-800 text-sm uppercase">
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
                            {reservations.map((r) => {
                                const now = new Date();
                                const start = new Date(`${r.date}T${r.startTime}`);
                                const end = new Date(`${r.date}T${r.endTime}`);
                                const status =
                                    now < start ? "Upcoming" : now >= start && now <= end ? "Active" : "Completed";

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
                                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                    >
                                        <td className="p-3">{r.field?.name || "N/A"}</td>
                                        <td className="p-3">{r.owner?.firstName || "N/A"}</td>
                                        <td className="p-3">{r.player?.firstName || "N/A"}</td>
                                        <td className="p-3">{new Date(r.date).toLocaleDateString()}</td>
                                        <td className="p-3">{r.startTime} - {r.endTime}</td>
                                        <td className="p-3">{r.totalPrice || 0} EGP</td>
                                        <td className="p-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${status === "Upcoming"
                                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                                        : status === "Active"
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                                    }`}
                                            >
                                                {status}
                                            </span>
                                        </td>
                                        <td className="p-3 flex gap-2">
                                            {canEdit && (
                                                <>
                                                    <button
                                                        onClick={() => setEditModal({ show: true, reservation: r })}
                                                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                                                    >
                                                        <Edit size={14} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(r._id)}
                                                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </button>
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

            {/* ✅ Mobile Cards */}
            <div className="grid md:hidden gap-4">
                {reservations.map((r) => (
                    <ReservationCard
                        key={r._id}
                        reservation={r}
                        userRole={userRole}
                        onEdit={() => setEditModal({ show: true, reservation: r })}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* ✅ Edit Modal */}
            {editModal.show && (
                <EditReservationModal
                    show={editModal.show}
                    reservation={editModal.reservation}
                    onClose={() => setEditModal({ show: false, reservation: null })}
                    onUpdated={handleUpdatedReservation}
                />
            )}
        </div>
    );
}
