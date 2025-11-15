import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, ArrowLeft, Heart } from "lucide-react";
import LoadingScreen from "../components/LoadingScreen";
import Button from "../components/Button";

export default function FavoritesPage({ user, darkMode, setDarkMode }) {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch favorite fields
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

    // Toggle favorite (remove from favorites)
    const handleToggleFavorite = async (fieldId) => {
        try {
            await api.patch(`/users/${fieldId}/favorite`);
            // Remove locally from favorites
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
        <main className={`container mx-auto p-4 min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Favorite Football Fields</h1>
                <div className="flex gap-3">
                    <Button
                        onClick={() => navigate("/dashboard")}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition ${darkMode
                            ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                            : "bg-white border-gray-300 text-gray-800 hover:bg-gray-200"
                            }`}
                    >
                        <ArrowLeft size={18} /> Back
                    </Button>
                    <Button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition ${darkMode
                            ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                            : "bg-white border-gray-300 text-gray-800 hover:bg-gray-200"
                            }`}
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </Button>
                </div>
            </div>

            {/* Favorite Fields Grid */}
            {favorites.length === 0 ?
                <div className={`flex h-screen justify-center items-center ${darkMode ? "text-gray-200 bg-gray-900" : "text-gray-500"}`}>
                    You have no favorite football fields yet.
                </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((field, idx) => (
                        <motion.div
                            key={field._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
                            className={`p-4 rounded-lg shadow-md cursor-pointer transition relative ${darkMode ? "bg-gray-800" : "bg-white"}`}
                            onClick={() => navigate(`/book/${field._id}`)}
                        >
                            {/* Heart button to remove from favorites */}
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavorite(field._id);
                                }}
                                className="absolute top-2 right-2 text-red-500 hover:scale-110 transition"
                            >
                                <Heart size={22} fill="red" />
                            </Button>

                            {field.images && field.images[0] && (
                                <img
                                    src={field.images[0].url}
                                    alt={field.name}
                                    className="w-full h-40 object-cover rounded-md mb-3"
                                />
                            )}
                            <h2 className="font-semibold text-lg mb-1">{field.name}</h2>
                            <p className="text-sm opacity-70 mb-1">{field.location}</p>
                            <p className="text-sm font-medium">Price: ${field.pricing}</p>
                            <p className="text-sm">Rating: {field.averageRating?.toFixed(1)} ⭐</p>
                        </motion.div>
                    ))}
                </div>}
        </main>
    );
}
