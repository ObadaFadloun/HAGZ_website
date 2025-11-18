import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, ArrowLeft, Heart } from "lucide-react";
import LoadingScreen from "../components/LoadingScreen";
import Button from "../components/Button";
import formatRating from "../utils/format";
import EmptyScreen from "../components/EmptyScreen";

export default function FavoritesPage({ user, darkMode, setDarkMode }) {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch favorites
    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user) return;

            try {
                const res = await api.get("/users/favorites");
                setFavorites(res.data.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load favorites");
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [user]);

    // Remove from favorites
    const handleToggleFavorite = async (fieldId) => {
        try {
            await api.patch(`/users/${fieldId}/favorite`);
            setFavorites((prev) => prev.filter((f) => f._id !== fieldId));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <LoadingScreen darkMode={darkMode} />;

    if (error)
        return (
            <div className="text-red-600 flex justify-center items-center h-screen">
                {error}
            </div>
        );

    return (
        <main
            className={`px-4 py-6 min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
                }`}
        >
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
                <h1 className="text-2xl font-bold text-center sm:text-left">
                    My Favorite Football Fields
                </h1>

                <div className="flex gap-3 justify-center sm:justify-start">
                    <Button
                        onClick={() => navigate("/dashboard")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${darkMode
                                ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                                : "bg-white border-gray-300 text-gray-800 hover:bg-gray-200"
                            }`}
                    >
                        <ArrowLeft size={18} /> Back
                    </Button>

                    <Button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${darkMode
                                ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                                : "bg-white border-gray-300 text-gray-800 hover:bg-gray-200"
                            }`}
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </Button>
                </div>
            </div>

            {/* Empty State */}
            {favorites.length === 0 ? (
                <EmptyScreen darkMode={darkMode} message="You have no favorite football fields yet." />
            ) : (
                /* Favorite Fields Grid - Highly Responsive */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map((field, idx) => (
                        <motion.div
                            key={field._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            whileHover={{
                                scale: 1.03,
                                boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
                            }}
                            className={`p-4 rounded-lg shadow-md relative cursor-pointer transition ${darkMode ? "bg-gray-800" : "bg-white"
                                }`}
                            onClick={() => navigate(`/book/${field._id}`)}
                        >
                            {/* Remove from favorites */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavorite(field._id);
                                }}
                                className="absolute top-2 right-2 text-red-500 hover:scale-110 transition"
                            >
                                <Heart size={22} fill="red" />
                            </button>

                            {/* Image */}
                            {field.images?.[0]?.url && (
                                <img
                                    src={field.images[0].url}
                                    alt={field.name}
                                    className="w-full h-40 object-cover rounded-md mb-3"
                                />
                            )}

                            {/* Field Info */}
                            <h2 className="font-semibold text-lg">{field.name}</h2>
                            <p className="text-sm opacity-70">{field.location}</p>
                            <p className="text-sm font-medium mt-1">
                                Price: ${field.pricing}
                            </p>
                            {field.averageRating && (
                                <p className="text-sm">Rating: {formatRating(field.averageRating)}⭐</p>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </main>
    );
}
