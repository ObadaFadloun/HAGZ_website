import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Trash2, Edit } from "lucide-react";
import api from "../../../utils/api";

export default function ReservationCard({ reservation, userRole, onEdit, onDelete }) {
    if (!reservation) return null;

    const now = new Date();
    const start = new Date(`${reservation.date}T${reservation.startTime}`);
    const end = new Date(`${reservation.date}T${reservation.endTime}`);

    const status =
        now < start ? "Upcoming" : now >= start && now <= end ? "Active" : "Completed";

    const canEditOrDelete =
        userRole === "admin" ||
        userRole === "owner" ||
        (userRole === "player" && now < start);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 flex flex-col gap-3 border border-gray-200 dark:border-gray-700 transition-all"
        >
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {reservation.field?.name || "Football Field"}
                </h3>
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
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm gap-2">
                <Calendar size={16} />
                <span>{new Date(reservation.date).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm gap-2">
                <Clock size={16} />
                <span>{reservation.startTime} - {reservation.endTime}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm gap-2">
                <MapPin size={16} />
                <span>{reservation.field?.location || "Unknown Location"}</span>
            </div>

            <div className="flex justify-between items-center mt-3">
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                    💰 {reservation.totalPrice || reservation.price} EGP
                </span>

                {canEditOrDelete && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(reservation)}
                            className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            <Edit size={14} /> Edit
                        </button>
                        <button
                            onClick={() => onDelete(reservation._id)}
                            className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
