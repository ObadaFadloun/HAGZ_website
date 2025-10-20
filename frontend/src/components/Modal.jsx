import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { X } from "lucide-react";

export default function Modal({ show, setShowModal, children, darkMode }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="modal"
                    className={`fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 md:px-8 transition-colors duration-300 ${darkMode
                            ? "bg-black/70 backdrop-blur-sm"
                            : "bg-gray-100/50 backdrop-blur-sm"
                        }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowModal(false)} // ✅ click outside closes modal
                >
                    {/* Modal content */}
                    <motion.div
                        key="content"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()} // ✅ prevent closing when clicking inside
                        className={`relative rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden transition-colors duration-300 ${darkMode
                                ? "bg-gray-900 text-gray-100 border border-gray-700"
                                : "bg-white text-gray-800 border border-gray-200"
                            }`}
                    >
                        {/* Close Button */}
                        <Button
                            type="button"
                            onClick={() => setShowModal(false)} // ✅ closes modal
                            className={`absolute top-3 right-3 rounded-full p-2 transition duration-200 ${darkMode
                                    ? "text-gray-400 hover:text-red-400 hover:bg-gray-800"
                                    : "text-gray-500 hover:text-red-500 hover:bg-gray-100"
                                }`}
                        >
                            <X size={22} />
                        </Button>

                        {/* Modal content area */}
                        <div className="max-h-[80vh] overflow-y-auto p-6 custom-scrollbar">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
