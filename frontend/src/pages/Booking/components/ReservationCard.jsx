import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Trash2, Edit } from "lucide-react";
import Button from "../../../components/Button";

export default function ReservationCard({ reservation, userRole, onEdit, onDelete, darkMode }) {
    if (!reservation) return null;

    const now = new Date();
    const start = new Date(`${reservation.date}T${reservation.startTime}`);
    const canEditOrDelete =
        userRole === "admin" ||
        userRole === "owner" ||
        (userRole === "player" && now < start);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-2xl shadow-md p-5 flex flex-col gap-3 border transition-all ${darkMode
                    ? "bg-gray-900 border-gray-700 text-gray-100"
                    : "bg-white border-gray-200 text-gray-800"
                }`}
        >
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                    {reservation.field?.name || "Football Field"}
                </h3>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${reservation.status === "cancelled"
                            ? darkMode
                                ? "bg-red-900 text-red-300"
                                : "bg-red-100 text-red-700"
                            : reservation.status === "active"
                                ? darkMode
                                    ? "bg-green-900 text-green-300"
                                    : "bg-green-100 text-green-700"
                                : darkMode
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-gray-200 text-gray-700"
                        }`}
                >
                    {reservation.status}
                </span>
            </div>

            {/* Date */}
            <div
                className={`flex items-center text-sm gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
            >
                <Calendar size={16} />
                <span>{new Date(reservation.date).toLocaleDateString()}</span>
            </div>

            {/* Time */}
            <div
                className={`flex items-center text-sm gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
            >
                <Clock size={16} />
                <span>
                    {reservation.startTime} - {reservation.endTime}
                </span>
            </div>

            {/* Location */}
            <div
                className={`flex items-center text-sm gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
            >
                <MapPin size={16} />
                <span>{reservation.field?.location || "Unknown Location"}</span>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-3">
                <span className={`font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                    💰 {reservation.totalPrice || reservation.price} EGP
                </span>

                {canEditOrDelete && reservation.status === "active" && (
                    <div className="flex gap-2">
                        <Button
                            onClick={() => onEdit(reservation)}
                            className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg transition ${darkMode
                                    ? "bg-blue-700 hover:bg-blue-800 text-white"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                        >
                            <Edit size={14} /> Edit
                        </Button>

                        <Button
                            onClick={() => onDelete(reservation._id)}
                            className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg transition ${darkMode
                                    ? "bg-red-700 hover:bg-red-800 text-white"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                                }`}
                        >
                            <Trash2 size={14} /> Delete
                        </Button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
