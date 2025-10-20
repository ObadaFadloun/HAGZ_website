import { motion } from "framer-motion";

export default function FieldFormSection({ title, children, icon: Icon, darkMode }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-4 transition-all duration-200 ${darkMode
                ? "bg-gray-900 border-gray-700 text-gray-200"
                : "bg-gray-50 border-gray-200 text-gray-800"}`}
        >
            {/* Title + Icon */}
            <div className="flex items-center gap-2 mb-3">
                {Icon && (
                    <Icon
                        className={`w-5 h-5 ${darkMode ? "text-green-500" : "text-green-600"
                            }`}
                    />
                )}
                <h3
                    className={`text-lg font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                >
                    {title}
                </h3>
            </div>

            {/* Content Section */}
            <div
                className={`p-4 rounded-xl border transition-all duration-200 ${darkMode
                    ? "bg-gray-900 border-gray-700 text-gray-200"
                    : "bg-gray-50 border-gray-200 text-gray-800"
                    }`}
            >
                {children}
            </div>
        </motion.section>
    );
}

