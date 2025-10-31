import React from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

export default function VideoReview({ videoUrl, darkMode }) {
    if (!videoUrl) return null;

    // Extract YouTube video ID from various URL formats
    const extractYouTubeId = (url) => {
        const regExp =
            /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    const videoId = extractYouTubeId(videoUrl);
    if (!videoId) return null;

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
        <motion.div
            className={`p-4 rounded-lg shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex items-center gap-2 mb-3">
                <PlayCircle size={20} className="text-green-600" />
                <h3 className="font-semibold text-lg">Video Review</h3>
            </div>

            <div className="relative w-full overflow-hidden rounded-xl aspect-video">
                <iframe
                    className="w-full h-full rounded-xl"
                    src={embedUrl}
                    title="Video Review"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </motion.div>
    );
}
