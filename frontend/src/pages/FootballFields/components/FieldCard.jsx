import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, Calendar, Trash2 } from "lucide-react";
import Button from "../../../components/Button";

export default function FieldCard({ user, field, darkMode, onEdit, onDelete }) {
    const navigate = useNavigate();
    const img =
        field.images?.length > 0 ? field.images[0].url :
            field.image ? field.image : "";

    const price = field.pricing || field.price || "—";

    const handleBook = () => {
        navigate(`/book/${field._id}`, { state: { field } });
    };

    const canManage = field.isOwnedByCurrentUser || user.role === "admin";

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative rounded-2xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"
                }`}
        >
            {/* Delete Button */}
            {canManage && (
                <Button
                    onClick={() => onDelete(field._id)}
                    className="absolute -top-2 -right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md transition"
                    title="Delete field"
                >
                    <Trash2 size={16} />
                </Button>
            )}

            {/* Image */}
            {img ? (
                <img src={img} alt={field.name} className="w-full h-44 object-cover" />
            ) : (
                <div className="w-full h-44 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    No image
                </div>
            )}

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-bold truncate">{field.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <MapPin size={14} /> <span>{field.location}</span>
                </div>

                <div className="flex justify-between items-center mt-3">
                    <div>
                        <div className="text-green-600 font-bold">
                            ${price} <span className="text-sm text-gray-500">/ hr</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 text-sm">
                            <Star size={14} /> <span>{field.averageRating ?? "—"}</span>
                        </div>
                    </div>

                    <div className="flex gap-5">
                        {canManage && (
                            <Button
                                className="flex items-center justify-center gap-1 w-24 bg-orange-600 text-white rounded"
                                onClick={() => onEdit(field)}
                            >
                                ✏️ Edit
                            </Button>
                        )}

                        <Button
                            className="flex items-center justify-center gap-1 w-24 bg-green-600 text-white rounded"
                            onClick={handleBook}
                        >
                            <Calendar size={14} /> Book
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
