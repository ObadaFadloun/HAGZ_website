// src/pages/Booking/components/LoadingScreen.jsx
import React from "react";
import Lottie from "lottie-react";
import loadingLottie from "../../../assets/loading.json";

export default function LoadingScreen({ darkMode }) {
    return (
        <div
            className={`flex justify-center items-center h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
                }`}
        >
            <Lottie animationData={loadingLottie} loop className="w-48 h-48" />
        </div>
    );
}
