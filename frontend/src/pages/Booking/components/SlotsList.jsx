import React, { useState } from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../../../components/Button";
import AlertModal from "../../../components/AlertModal";

export default function SlotsList({
    slots,
    user,
    selectedSlot,
    setSelectedSlot,
    darkMode,
    handleBook,
    fetchSlots,
    setSlots,
}) {
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        title: "Notification"
    });

    const showAlert = (message, title = "Notification") => {
        setAlert({ show: true, message, title });
    };

    const closeAlert = () => {
        setAlert({ show: false, message: "", title: "Notification" });
    };

    const handleSlot = (slot) => {
        const disabled = !slot.available;
        const isMine = slot.playerId === user?._id;

        const statusClass = disabled
            ? isMine
                ? slot.status === "cancelled"
                    ? `${slot.isPast ? "bg-red-600/50" : "bg-red-600"} text-white cursor-not-allowed`
                    : slot.status === "completed"
                        ? "bg-green-600/50 text-white cursor-not-allowed"
                        : slot.status === "active"
                            ? `${slot.isPast ? "bg-green-600/50" : "bg-green-600"} opacity-100 text-white cursor-not-allowed`
                            : ""
                : "bg-gray-500/20 text-gray-400 cursor-not-allowed"
            : selectedSlot?.id === slot.id
                ? "bg-green-400 text-white"
                : `${darkMode ? "hover:bg-gray-700" : "hover:bg-green-50"} cursor-pointer`;

        return { statusClass, disabled };
    };

    const bookNow = async () => {
        if (!selectedSlot) {
            showAlert("Please select a slot first!");
            return;
        }
        try {
            setSlots((prev) =>
                prev.map((slot) =>
                    slot.id === selectedSlot.id
                        ? { ...slot, available: false, playerId: user._id, status: "active" }
                        : slot
                )
            );
            await handleBook();
            await fetchSlots();
        } catch (err) {
            console.error(err);
            showAlert("❌ Booking failed, please try again.");
        }
    };

    return (
        <motion.div
            className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <h4 className="font-semibold flex items-center gap-2 mb-2">
                <Clock size={18} /> Available Slots
            </h4>

            {/* ✅ FIXED: ensure list visible immediately (removed hover trigger dependency) */}
            <div className="mt-3 grid grid-cols-1 gap-2">
                {slots && slots.length > 0 ? (
                    slots.map((slot) => {
                        const { statusClass, disabled } = handleSlot(slot);
                        return (
                            <motion.button
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot)}
                                disabled={disabled}
                                whileHover={!disabled ? { scale: 1.02 } : {}}
                                whileTap={!disabled ? { scale: 0.97 } : {}}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`p-2 rounded-lg border flex justify-between items-center ${statusClass}`}
                            >
                                <span>{slot.label}</span>
                                <span className="text-sm font-semibold">${slot.price}</span>
                            </motion.button>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500 py-3">No slots available</p>
                )}
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                    className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-800 text-white"
                    onClick={bookNow}
                >
                    Book Now
                </Button>
            </motion.div>

            {/* ✅ Add AlertModal */}
            <AlertModal
                show={alert.show}
                message={alert.message}
                title={alert.title}
                onClose={closeAlert}
                darkMode={darkMode}
            />
        </motion.div>
    );
}
