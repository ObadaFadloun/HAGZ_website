import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";
import Button from "./Button";

export default function AlertModal({ show, message, onClose, darkMode, onConfirm, title = "Notification" }) {
    const hasConfirmAction = typeof onConfirm === 'function';

    const handleConfirm = () => {
        if (hasConfirmAction) {
            onConfirm();
        } else {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md"
                >
                    <motion.div
                        className={`relative w-full rounded-xl shadow-lg border
                        ${darkMode
                                ? "bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 text-gray-100"
                                : "bg-gradient-to-br from-white to-gray-100 border-gray-200 text-gray-900"
                            }`}
                    >
                        {/* Header */}
                        <h3 className={`text-base font-semibold mb-1 mt-4 text-center ${darkMode ? "text-green-400" : "text-green-600"}`}>
                            {title}
                        </h3>

                        {/* Message */}
                        <p className="text-sm leading-relaxed text-center px-4 pb-4">{message}</p>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-3 pb-4">
                            {hasConfirmAction && (
                                <Button
                                    onClick={onClose}
                                    className={`px-4 py-1.5 rounded-lg font-medium text-sm transition-all duration-300
                                    ${darkMode
                                            ? "bg-gray-600 text-white hover:bg-gray-500"
                                            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                                        }`}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button
                                onClick={handleConfirm}
                                className={`px-4 py-1.5 rounded-lg font-medium text-sm transition-all duration-300
                                ${darkMode
                                        ? "bg-green-600 text-white hover:bg-green-500"
                                        : "bg-green-500 text-white hover:bg-green-600"
                                    }`}
                            >
                                {hasConfirmAction ? "Confirm" : "OK"}
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}