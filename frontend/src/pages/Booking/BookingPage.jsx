import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";

import LoadingScreen from "../../components/LoadingScreen";
import CoverSection from "./components/CoverSection";
import VideoReviewSection from "./components/VideoReviewSection"
import MapSection from "./components/MapSection";
import AboutSection from "./components/AboutSection";
import WeatherCard from "./components/WeatherCard";
import FacilitiesCard from "./components/FacilitiesCard";
import SlotsList from "./components/SlotsList";
import DateSelector from "./components/DateSelector";
import ReviewsSection from "./components/ReviewsSection";
import AlertModal from "../../components/AlertModal";

export default function BookingPage({ user, darkMode, setDarkMode, onBooked }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [field, setField] = useState(null);
    const [isOwnedByCurrentUser, setIsOwnedByCurrentUser] = useState(false);
    const [BookedSlots, setBookedSlots] = useState([]);

    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        return d.toISOString().slice(0, 10);
    });
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [slots, setSlots] = useState([]);

    const [reviews, setReviews] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loadingReviews, setLoadingReviews] = useState(true);

    const [alert, setAlert] = useState({
        show: false,
        message: "",
        onConfirm: null,
        title: "Notification"
    });

    const showAlert = (message, onConfirm = null, title = "Notification") => {
        setAlert({ show: true, message, onConfirm, title });
    };

    const closeAlert = () => {
        setAlert({ show: false, message: "", onConfirm: null, title: "Notification" });
    };

    const fetchField = async () => {
        try {
            const res = await api.get(`/football-fields/${id}`);
            const fieldData = res?.data?.data?.field || res?.data?.data || res?.data;
            setField(fieldData);
            setIsOwnedByCurrentUser(fieldData.ownerId?.id === user.id)

            const resRes = await api.get(`/reservations/field/${id}`);
            const reservations = Array.isArray(resRes?.data?.data)
                ? resRes.data.data
                : resRes.data?.data?.reservations || [];
            setBookedSlots(reservations);
        } catch (err) {
            setError("Something went wrong while loading field data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            setLoadingReviews(true);
            const res = await api.get(`/reviews/field/${id}`);
            setReviews(res.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        } finally {
            setLoadingReviews(false);
        }
    };


    useEffect(() => {
        fetchField();
        fetchReviews();
    }, [id]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user || !field?._id) return;

            try {
                const res = await api.get('/users/favorites');
                const favs = res.data.data;
                const fav = favs.some(f => f._id.toString() === field._id.toString());
                setIsFavorite(fav);
            } catch (err) {
                console.error(err);
            }
        };

        fetchFavorites();
    }, [user, field]);


    const handleToggleFavorite = async () => {
        if (!field?._id) return;

        try {
            await api.patch(`/users/${field._id}/favorite`);
            setIsFavorite(prev => !prev);
        } catch (err) {
            console.error(err);
        }
    };


    const fetchReservationsForField = async () => {
        if (!field?._id) return;
        try {
            const resRes = await api.get(`/reservations/field/${field._id}`);
            const reservations = Array.isArray(resRes?.data?.data)
                ? resRes.data.data
                : resRes.data?.data?.reservations || [];
            setBookedSlots(reservations);
        } catch (err) {
            console.error("Failed to fetch reservations for field:", err);
        }
    };

    useEffect(() => {
        fetchReservationsForField();
    }, [field, selectedDate]);

    const parseHour = (t) => {
        if (!t || typeof t !== "string") return 8;
        const [hh] = t.split(":");
        const num = Number(hh);
        return isNaN(num) ? 8 : num;
    };

    const generateSlots = () => {
        if (!field || !field.openTime || !field.closeTime) return;

        const open = parseHour(field.openTime);
        const close = parseHour(field.closeTime);
        const arr = [];

        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10);

        for (let h = open; h < close; h++) {
            const start = `${String(h).padStart(2, "0")}:00`;
            const end = `${String(h + 1).padStart(2, "0")}:00`;
            const slotId = `${selectedDate}-${h}`;

            const slotDateObj = new Date(selectedDate);
            const todayMidnight = new Date(now.toDateString());
            const isPastDay = slotDateObj < todayMidnight;

            const isSelectedToday = selectedDate === todayStr;
            const isPastHour = isSelectedToday && h <= now.getHours();

            const isBookedReservation = BookedSlots.find((r) => {
                let rDateStr = "";
                if (!r) return false;
                if (r.date instanceof Date) {
                    rDateStr = r.date.toISOString().slice(0, 10);
                } else {
                    try {
                        rDateStr = new Date(r.date).toISOString().slice(0, 10);
                    } catch {
                        rDateStr = typeof r.date === "string" ? r.date.slice(0, 10) : "";
                    }
                }

                const rStart = r.startTime ? r.startTime.slice(0, 5) : null;
                return rDateStr === selectedDate && rStart === start;
            });

            arr.push({
                id: slotId,
                label: `${start} - ${end}`,
                price: field?.pricing || 0,
                playerId: isBookedReservation?.player?._id || null,
                status: isBookedReservation?.status || null,
                available: !(isPastDay || isPastHour || !!isBookedReservation),
                isPast: isPastDay || isPastHour,
            });
        }

        setSlots(arr);
    };

    useEffect(() => {
        if (field && field.openTime && field.closeTime) {
            generateSlots();
        }
    }, [field, selectedDate, BookedSlots]);

    // ✅ Auto-refresh past slot state every 1 minute
    useEffect(() => {
        const interval = setInterval(() => {
            generateSlots();
        }, 60000);
        return () => clearInterval(interval);
    }, [field, selectedDate, BookedSlots]);

    const handleBook = async () => {
        if (!selectedSlot) {
            showAlert("Please pick a slot first");
            return;
        }

        const [startTime, endTime] = selectedSlot.label.split(" - ");
        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10);
        const chosenDate = selectedDate;

        if (new Date(chosenDate) < new Date(now.toDateString())) {
            showAlert("You cannot book a past date.");
            return;
        }

        if (chosenDate === todayStr) {
            const startHour = parseInt(startTime.split(":")[0], 10);
            if (startHour <= now.getHours()) {
                showAlert("You cannot book a past hour today.");
                return;
            }
        }

        try {
            const res = await api.post("/reservations", {
                field: field._id,
                startTime,
                endTime,
                totalPrice: selectedSlot.price,
                date: selectedDate,
            });

            const newReservation = res.data?.data || res.data;
            const normalized = Array.isArray(newReservation)
                ? newReservation[0]
                : newReservation;

            setBookedSlots((prev) => [...prev, normalized]);
            await fetchReservationsForField();

            onBooked?.(res.data);
            showAlert("✅ Booked successfully!");
        } catch (err) {
            console.error(err);
            showAlert(err.response?.data?.message || "Booking failed");
        }
    };

    const handleAddComment = async ({ text, rating }) => {
        try {
            const res = await api.post("/reviews", {
                field: id,
                text,
                rating,
            });
            const newReview = res.data?.data;
            setReviews((prev) => [newReview, ...prev]);

            await fetchField();
        } catch (err) {
            showAlert(err.response?.data?.message || "Failed to add review");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        showAlert(
            "Are you sure you want to delete this review?",
            async () => {
                try {
                    await api.delete(`/reviews/${reviewId}`);
                    setReviews((prev) => prev.filter((r) => r._id !== reviewId));
                    showAlert("Review deleted successfully ✅");
                } catch (err) {
                    showAlert(err.response?.data?.message || "Failed to delete review");
                }
            },
            "Confirm Deletion"
        );
    };

    if (loading) return <LoadingScreen darkMode={darkMode} />;

    if (error)
        return (
            <div className="flex items-center justify-center h-screen text-red-600">
                {error}
            </div>
        );

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
            className={`bg-gradient-to-r ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-300 text-gray-900"
                } min-h-screen pb-20`}
        >
            <CoverSection
                field={field}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                navigate={navigate}
            />

            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="container mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                <motion.article
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {field?.video && (
                        <VideoReviewSection videoUrl={field.video} darkMode={darkMode} />
                    )}
                    <MapSection mapLink={field.mapLink} />
                    <AboutSection field={field} darkMode={darkMode} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <WeatherCard
                            location={field.location}
                            mapLink={field.mapLink}
                            date={selectedDate}
                            darkMode={darkMode}
                        />
                        <FacilitiesCard field={field} darkMode={darkMode} />
                    </div>
                    {loadingReviews ? (
                        <div className="text-center text-sm opacity-70 mt-4">Loading reviews...</div>
                    ) : (
                        <ReviewsSection
                            user={user}
                            darkMode={darkMode}
                            reviews={reviews}
                            onAddComment={handleAddComment}
                            onDeleteReview={handleDeleteReview}
                            onToggleFavorite={handleToggleFavorite}
                            isFavorite={isFavorite}
                            isOwnedByCurrentUser={isOwnedByCurrentUser}
                        />
                    )}
                </motion.article>

                <motion.aside
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                >
                    <DateSelector
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        darkMode={darkMode}
                    />
                    <SlotsList
                        slots={slots}
                        user={user}
                        selectedSlot={selectedSlot}
                        setSelectedSlot={setSelectedSlot}
                        darkMode={darkMode}
                        handleBook={handleBook}
                        fetchSlots={fetchReservationsForField}
                        setSlots={setSlots}
                    />
                </motion.aside>
            </motion.section>

            {/* ✅ Alert Modal */}
            <AlertModal
                show={alert.show}
                message={alert.message}
                title={alert.title}
                onClose={closeAlert}
                darkMode={darkMode}
            />
        </motion.main>
    );
}
