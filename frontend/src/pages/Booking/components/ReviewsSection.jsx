import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Star,
    ThumbsUp,
    ThumbsDown,
} from "lucide-react";
import Button from "../../../components/Button";
import AlertModal from "../../../components/AlertModal";

const ReviewsSection = ({
    user,
    darkMode,
    reviews = [],
    onAddComment,
    onDeleteReview,
    onToggleFavorite,
    isFavorite = false,
    isOwnedByCurrentUser,
}) => {
    const [reviewIndex, setReviewIndex] = useState(0);
    const [commentText, setCommentText] = useState("");
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [favorite, setFavorite] = useState(isFavorite);
    const [submitting, setSubmitting] = useState(false);

    const [alert, setAlert] = useState({
        show: false,
        message: "",
        onConfirm: null,
        title: "Notification",
    });

    const showAlert = (message, onConfirm = null, title = "Notification") => {
        setAlert({ show: true, message, onConfirm, title });
    };

    const closeAlert = () => {
        setAlert({
            show: false,
            message: "",
            onConfirm: null,
            title: "Notification",
        });
    };

    const nextReview = () => {
        if (reviews.length > 0) {
            setReviewIndex((prev) => (prev + 1) % reviews.length);
        }
    };

    const prevReview = () => {
        if (reviews.length > 0) {
            setReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) {
            showAlert("Please write a comment first!");
            return;
        }

        setSubmitting(true);
        await onAddComment?.({ text: commentText, rating });
        setSubmitting(false);
        setCommentText("");
        setRating(5);
        setHoverRating(0);
    };

    const handleToggleFavorite = () => {
        const newState = !favorite;
        setFavorite(newState);
        onToggleFavorite?.(newState);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`p-4 rounded-xl shadow-lg ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-lg">Reviews</h4>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={prevReview}
                        className={`p-2 rounded transition ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                            }`}
                    >
                        <ChevronLeft size={18} />
                    </Button>
                    <Button
                        onClick={nextReview}
                        className={`p-2 rounded transition ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                            }`}
                    >
                        <ChevronRight size={18} />
                    </Button>
                </div>
            </div>

            {/* Reviews Display */}
            <div className="mt-2 min-h-[100px]">
                {reviews.length === 0 ? (
                    <div className="text-sm opacity-70 italic">
                        No reviews yet — be the first to review!
                    </div>
                ) : (
                    <motion.div
                        key={reviews[reviewIndex]?._id || reviewIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <div
                                className={`font-medium ${reviews[reviewIndex]?.rating > 2
                                    ? reviews[reviewIndex]?.rating > 3
                                        ? "text-green-600"
                                        : "text-yellow-600"
                                    : "text-red-600"
                                    }`}
                            >
                                {reviews[reviewIndex]?.user?.firstName ?? "Anonymous"}
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Star size={16} /> {reviews[reviewIndex]?.rating}
                                </div>

                                {/* 🗑️ Delete button — only if current user owns this review */}
                                {user?._id === reviews[reviewIndex]?.user?._id && (
                                    <Button
                                        onClick={() =>
                                            showAlert(
                                                "Are you sure you want to delete this review?",
                                                () => onDeleteReview?.(reviews[reviewIndex]._id),
                                                "Confirm Delete"
                                            )
                                        }
                                    >
                                        🗑️
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="text-sm opacity-90 leading-relaxed">
                            {reviews[reviewIndex]?.text}
                        </div>
                        <div className="text-xs opacity-60">
                            {new Date(reviews[reviewIndex]?.createdAt).toLocaleString()}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Divider */}
            {(!isOwnedByCurrentUser || user.role === "admin")&& (
                <>
                    <div
                        className={`my-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"
                            }`}
                    />

                    {/* Like / Dislike (Favorite toggle) */}
                    <div className="flex gap-6 mb-4">
                        <div className="mb-4">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleToggleFavorite}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition cursor-pointer
            ${favorite
                                        ? "bg-red-600 border-red-700 text-white"
                                        : darkMode
                                            ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                                            : "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200"
                                    }`}
                            >
                                {favorite ? "❤️ Remove from Favorite" : "🤍 Add to Favorite"}
                            </motion.button>
                        </div>
                    </div>

                    {/* Add Comment */}
                    <div>
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className={`w-full p-2 rounded-lg resize-none focus:outline-none ${darkMode
                                ? "bg-gray-700 text-gray-100 placeholder-gray-400"
                                : "bg-gray-50 text-gray-900 placeholder-gray-500"
                                }`}
                            rows={3}
                        />
                        <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                                <label className="text-sm">Rating:</label>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={22}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className={`cursor-pointer transition ${(hoverRating || rating) >= star
                                            ? "fill-yellow-400 text-yellow-400"
                                            : darkMode
                                                ? "text-gray-500"
                                                : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <Button
                                onClick={handleAddComment}
                                disabled={submitting}
                                className="bg-gradient-to-r from-green-600 to-green-800 hover:opacity-90 text-white"
                            >
                                {submitting ? "Adding..." : "Add Comment"}
                            </Button>
                        </div>
                    </div>
                </>
            )}

            {/* Alert Modal */}
            <AlertModal
                show={alert.show}
                message={alert.message}
                title={alert.title}
                onClose={closeAlert}
                // No onConfirm prop = shows OK button only
                darkMode={darkMode}
            />
        </motion.div>
    );
};

export default ReviewsSection;
