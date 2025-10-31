// src/pages/Booking/components/AboutSection.jsx
import React from "react";

export default function AboutSection({ field, darkMode }) {
    return (
        <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className="text-lg font-bold">About:</h3>

            <div className="flex flex-wrap gap-2 mt-3">
                {field?.tags?.length ? (
                    field.tags.map((t, idx) => (
                        <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-sm ${darkMode ? "bg-gray-700 text-gray-200" : "bg-green-100 text-green-800"
                                }`}
                        >
                            {t}
                        </span>
                    ))
                ) : (
                    <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? "bg-gray-700 text-gray-200" : "bg-green-100 text-green-800"
                        }`}>
                        No tags provided
                    </span>
                )}
            </div>

            <div className="mt-4 text-sm text-gray-400">
                {field?.description || ""}
            </div>
        </div>
    );
}
