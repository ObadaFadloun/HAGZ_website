import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import ReservationCard from "./ReservationCard";
import EditReservationModal from "./EditReservationModal";
import Button from "../../../components/Button";

export default function ReservationsTable({
    reservations,
    handleReject,
    handleDelete,
    handleUpdatedReservation,
    darkMode,
    userRole,
    user
}) {
    const [editModal, setEditModal] = useState({ show: false, reservation: null });

    return (
        <div className={`${darkMode ? "dark bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"} transition-all`}>
            {/* ✅ Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <motion.table
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`min-w-full border rounded-xl overflow-hidden ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                    <thead className={`text-sm uppercase ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
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
                                const status = r.status;

                                const canEdit = status !== "completed" &&
                                    (userRole === "admin" ||
                                        r.owner?.id === user.id ||
                                        r.player?.id === user.id)

                                const canReject = status !== "completed" &&
                                    (userRole === "admin" ||
                                        r.owner?.id === user.id)

                                const canDelete = status !== "completed" && r.player?.id === user._id;

                                return (
                                    <motion.tr
                                        key={r._id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`border-b transition ${darkMode
                                            ? "border-gray-700 hover:bg-gray-800"
                                            : "border-gray-100 hover:bg-gray-100"
                                            }`}
                                    >
                                        <td className="p-3">{r.field?.name || "N/A"}</td>
                                        <td className="p-3">{r.owner?.firstName || "N/A"}</td>
                                        <td className="p-3">{r.player?.firstName || "N/A"}</td>
                                        <td className="p-3">{new Date(r.date).toLocaleDateString()}</td>
                                        <td className="p-3">{r.startTime} - {r.endTime}</td>
                                        <td className="p-3">{r.totalPrice || 0} EGP</td>
                                        <td className="p-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${status === "active"
                                                    ? darkMode
                                                        ? "bg-green-900 text-green-300"
                                                        : "bg-green-100 text-green-700"
                                                    : status === "cancelled"
                                                        ? darkMode
                                                            ? "bg-red-900 text-red-300"
                                                            : "bg-red-100 text-red-700"
                                                        : darkMode
                                                            ? "bg-gray-700 text-gray-300"
                                                            : "bg-gray-200 text-gray-700"
                                                    }`}
                                            >
                                                {status}
                                            </span>
                                        </td>
                                        <td className="p-3 flex gap-2">
                                            {canEdit && (
                                                <Button
                                                    onClick={() => setEditModal({ show: true, reservation: r })}
                                                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <Edit size={14} /> Edit
                                                </Button>
                                            )}
                                            {canDelete && (
                                                <Button
                                                    onClick={() => handleDelete(r._id)}
                                                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </Button>
                                            )}
                                            {canReject && !canDelete && (
                                                <Button
                                                    onClick={() => handleReject(r._id)}
                                                    className="flex items-center gap-1 px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                                                >
                                                    Reject
                                                </Button>
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
                        onReject={handleReject} 
                        darkMode={darkMode}
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
                    darkMode={darkMode}
                    user={user}
                />
            )}
        </div>
    );
}