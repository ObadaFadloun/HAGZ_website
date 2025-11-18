import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import empty from "../assets/empty.json";
import Button from "./Button";

export default function EmptyScreen({ darkMode, message = "" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`flex flex-col text-center items-center py-20 rounded-xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
            <Lottie animationData={empty} loop className="w-48 h-48" />
            <p className="text-lg font-bold opacity-70">{message}</p>
            <Button
                className="mt-6 text-white bg-gradient-to-r from-green-600 to-green-800 font-bold hover:shadow-xl"
                onClick={() => window.location.reload()}
            >
                Refresh Page
            </Button>
        </motion.div>
    );
}
