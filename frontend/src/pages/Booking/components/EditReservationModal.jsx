import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../utils/api";
import Button from "../../../components/Button";
import AlertModal from "../../../components/AlertModal";

export default function EditReservationModal({
    user,
    show,
    onClose,
    reservation,
    onUpdated,
    darkMode = false,
}) {
    const [newDate, setNewDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [saving, setSaving] = useState(false);
    const [slotsList, setSlotsList] = useState([]);

    const [alert, setAlert] = useState({ show: false, message: "", onConfirm: null });

    const showAlert = (message, onConfirm = null) => {
        setAlert({ show: true, message, onConfirm });
    };

    const closeAlert = () => {
        setAlert({ show: false, message: "", onConfirm: null });
    };

    // 🔹 Fetch available slots (includes status: active, completed, cancelled, available)
    const fetchAvailableSlots = async (date) => {
        // ✅ Better safety checks
        if (!reservation || !reservation.field || !reservation.field._id) {
            console.warn('Cannot fetch slots: Missing reservation data');
            return;
        }

        // ✅ Check if user exists
        if (!user || !user._id) {
            console.warn('Cannot fetch slots: Missing user data');
            return;
        }

        try {
            const res = await api.get(
                `/football-fields/${reservation.field._id}/available-slots`,
                { params: { date, userId: user._id } }
            );
            setSlotsList(res.data.slots || []);
        } catch (err) {
            console.error('Failed to fetch slots:', err);
            showAlert("Failed to load available slots");
        }
    };


    /// ✅ Sync modal date with reservation (with safety checks)
    useEffect(() => {
        if (reservation && reservation.field && reservation.field._id) {
            const formattedDate = reservation.date
                ? reservation.date.slice(0, 10)
                : "";
            setNewDate(formattedDate);
            setSelectedSlot(null);

            if (formattedDate && user && user._id) {
                fetchAvailableSlots(formattedDate);
            }
        }
    }, [reservation, show]);

    // ✅ Auto-refresh slots every 15s (with safety checks)
    useEffect(() => {
        if (!newDate || !reservation?.field?._id || !user?._id) return;

        const interval = setInterval(() => {
            fetchAvailableSlots(newDate);
        }, 15000);

        return () => clearInterval(interval);
    }, [newDate, reservation, user]);

    // 🔹 Only allow editing if more than 2 hours before start time
    const canEdit = () => {
        if (!reservation?.date || !reservation?.startTime) return false;

        const now = new Date();

        // Handle both ISO and plain date strings
        let datePart = reservation.date;
        if (datePart.includes("T")) {
            datePart = datePart.split("T")[0]; // → "2025-11-01"
        }

        const resStartStr = `${datePart}T${reservation.startTime.length === 5
            ? reservation.startTime + ":00"
            : reservation.startTime
            }`;

        const resStart = new Date(resStartStr);

        if (isNaN(resStart)) {
            return false;
        }

        const diffHours = (resStart - now) / (1000 * 60 * 60);

        return diffHours > 2;
    };

    const handleSave = async () => {
        if (!canEdit()) {
            showAlert("You cannot edit a reservation within 2 hours of start time.");
            return;
        }

        if (new Date(newDate) < new Date().setHours(0, 0, 0, 0)) {
            showAlert("You cannot select a past date.");
            return;
        }

        if (!selectedSlot) {
            showAlert("Please select a new slot before saving.");
            return;
        }

        setSaving(true);
        try {
            const res = await api.patch(`/reservations/${reservation._id}`, {
                date: newDate,
                startTime: selectedSlot.startTime,
                endTime: selectedSlot.endTime,
                price: selectedSlot.price,
            });
            onUpdated(res.data.data);
            onClose();
        } catch (err) {
            console.error(err);
            showAlert(err.response?.data?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        showAlert(
            "Are you sure you want to close without saving?",
            () => {
                onClose();
                closeAlert();
            }
        );
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className={`rounded-2xl p-6 w-full max-w-md shadow-lg transition-colors
              ${darkMode
                                ? "bg-gray-900 text-gray-100"
                                : "bg-white text-gray-900"
                            }`}
                    >
                        <h3 className="text-lg font-semibold mb-3">Edit Reservation</h3>

                        {/* 📅 Select Date */}
                        <label className="block mb-2 text-sm">Select Date</label>
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => {
                                const selectedDate = e.target.value;
                                setNewDate(selectedDate);
                                fetchAvailableSlots(selectedDate);
                            }}
                            min={new Date().toISOString().split("T")[0]}
                            className={`border p-2 rounded w-full mb-3 transition 
                ${darkMode
                                    ? "bg-gray-800 border-gray-700 text-gray-100"
                                    : "bg-white border-gray-300 text-gray-900"
                                }`}
                        />

                        {/* ⏰ Available Slots List */}
                        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                            {slotsList.length === 0 ? (
                                <p className="text-gray-500 text-sm">
                                    No slots found for this date.
                                </p>
                            ) : (
                                slotsList.map((slot) => (
                                    <Button
                                        key={slot.id}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`p-2 rounded-lg border flex justify-between items-center transition
                ${selectedSlot?.id === slot.id
                                                ? "bg-green-600 text-white border-green-700"
                                                : darkMode
                                                    ? "hover:bg-gray-800 border-gray-700"
                                                    : "hover:bg-green-50 border-gray-200"
                                            }`}
                                    >
                                        <span>{slot.label}</span>
                                        <span className="text-sm font-semibold">${slot.price}</span>
                                    </Button>
                                ))
                            )}
                        </div>

                        {/* 🧭 Footer Buttons */}
                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                onClick={handleCancel}
                                className={`px-4 py-2 border rounded-lg transition
                  ${darkMode
                                        ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className={`px-4 py-2 rounded-lg text-white transition
                  ${saving ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
                                    } 
                  ${darkMode
                                        ? "bg-green-700 hover:bg-green-800"
                                        : "bg-green-600 hover:bg-green-700"
                                    }`}
                            >
                                {saving ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Alert Modal */}
            <AlertModal
                show={alert.show}
                message={alert.message}
                onClose={closeAlert}
                onConfirm={alert.onConfirm || closeAlert}
                darkMode={darkMode}
            />
        </AnimatePresence>
    );
}
