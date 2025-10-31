import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";

import LoadingScreen from "./components/LoadingScreen";
import CoverSection from "./components/CoverSection";
import VideoReviewSection from "./components/VideoReviewSection"
import MapSection from "./components/MapSection";
import AboutSection from "./components/AboutSection";
import WeatherCard from "./components/WeatherCard";
import FacilitiesCard from "./components/FacilitiesCard";
import SlotsList from "./components/SlotsList";
import DateSelector from "./components/DateSelector";
import EditReservationModal from "./components/EditReservationModal";

export default function BookingPage({ user, darkMode, setDarkMode, onBooked }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [field, setField] = useState(null);
    const [BookedSlots, setBookedSlots] = useState([]);

    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        return d.toISOString().slice(0, 10);
    });
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [slots, setSlots] = useState([]);

    const fetchField = async () => {
        try {
            const res = await api.get(`/football-fields/${id}`);
            const fieldData = res?.data?.data?.field || res?.data?.data || res?.data;
            setField(fieldData);

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

    useEffect(() => {
        fetchField();
    }, [id]);

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
                isPast: isPastDay || isPastHour, // ✅ added for UI fading
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
        if (!selectedSlot) return alert("Please pick a slot first");

        const [startTime, endTime] = selectedSlot.label.split(" - ");
        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10);
        const chosenDate = selectedDate;

        if (new Date(chosenDate) < new Date(now.toDateString())) {
            return alert("You cannot book a past date.");
        }

        if (chosenDate === todayStr) {
            const startHour = parseInt(startTime.split(":")[0], 10);
            if (startHour <= now.getHours()) {
                return alert("You cannot book a past hour today.");
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
            alert("✅ Booked successfully!");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Booking failed");
        }
    };

    const [editModal, setEditModal] = useState({ show: false, reservation: null });

    const openEditModal = (slot) => {
        const myReservation = BookedSlots.find(
            (r) => r.startTime.slice(0, 5) === slot.label.split(" - ")[0] && r.player?._id === user?._id
        );
        if (myReservation) {
            setEditModal({ show: true, reservation: myReservation });
        }
    };

    const handleUpdatedReservation = (updated) => {
        setBookedSlots((prev) =>
            prev.map((r) => (r._id === updated._id ? updated : r))
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
                        openEditModal={(reservation) =>
                            setEditModal({ show: true, reservation })
                        }
                    />

                    <EditReservationModal
                        slots={slots}
                        show={editModal.show}
                        reservation={editModal.reservation}
                        onClose={() => setEditModal({ show: false, reservation: null })}
                        onUpdated={handleUpdatedReservation}
                        darkMode={darkMode}
                    />
                </motion.aside>
            </motion.section>
        </motion.main>
    );
}
