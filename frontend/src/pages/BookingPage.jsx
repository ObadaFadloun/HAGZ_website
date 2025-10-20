import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Sun, Cloud, CloudRain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

// BookingPage component
// Props:
// - field: the football field object (from API). Should contain: name, images (array of {url}), location, pricing, facilities, description, openTime, closeTime, capacity, tags, averageRating, ownerId
// - user: current user
// - darkMode: boolean
// - onBooked: optional callback after successful booking

export default function BookingPage({ field, user, darkMode, onBooked }) {
    const navigate = useNavigate();
    const [coverIndex, setCoverIndex] = useState(0);
    const [weather, setWeather] = useState(null);
    const [reviews, setReviews] = useState(field?.reviews ?? []);
    const [reviewIndex, setReviewIndex] = useState(0);
    const [commentText, setCommentText] = useState("");
    const [rating, setRating] = useState(5);
    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        return d.toISOString().slice(0, 10);
    });
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [slots, setSlots] = useState([]);
    const carouselRef = useRef(null);

    // Build image list from field.images (handle several shapes)
    const images = (field?.images || []).map((i) => (typeof i === 'string' ? i : i?.url || '')).filter(Boolean);

    useEffect(() => {
        // mock or real weather fetch - replace with your weather endpoint
        async function fetchWeather() {
            try {
                // NOTE: replace `/api/weather?location=` with your real weather API endpoint
                const res = await fetch(`/api/weather?location=${encodeURIComponent(field?.location || '')}`);
                if (!res.ok) throw new Error('no weather');
                const json = await res.json();
                setWeather(json);
            } catch (err) {
                // fallback mock
                setWeather({ temp: 28, condition: 'Partly cloudy', icon: 'partly-cloudy' });
            }
            console.log(field)
        }
        fetchWeather();

        // generate example slots for the chosen date (like cinema slots) — 1-hour slots between openTime and closeTime
        const generateSlots = () => {
            const open = parseHour(field?.openTime || '08:00');
            const close = parseHour(field?.closeTime || '22:00');
            const arr = [];
            for (let h = open; h < close; h++) {
                arr.push({
                    id: `${selectedDate}-${h}`,
                    label: `${String(h).padStart(2, '0')}:00 - ${String(h + 1).padStart(2, '0')}:00`,
                    price: field?.pricing || 0,
                    available: Math.random() > 0.25 // random availability demo
                });
            }
            setSlots(arr);
        };
        generateSlots();
    }, [field, selectedDate]);

    useEffect(() => {
        // reset review index if reviews change
        setReviewIndex((idx) => Math.max(0, Math.min(idx, (reviews.length || 1) - 1)));
    }, [reviews]);

    function parseHour(t) {
        if (!t) return 8;
        const [hh] = t.split(':');
        return Number(hh);
    }

    const gotoBooking = () => {
        // scroll to booking form or navigate to a dedicated booking route
        document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAddComment = () => {
        if (!commentText) return;
        const newReview = {
            id: Date.now(),
            user: { firstName: user?.firstName || 'Guest' },
            text: commentText,
            rating,
            createdAt: new Date().toISOString()
        };
        setReviews((prev) => [newReview, ...prev]);
        setCommentText('');
        setRating(5);
    };

    const handleBook = async () => {
        if (!selectedSlot) {
            alert('Please pick a slot first');
            return;
        }
        try {
            // example booking submit — replace with your API
            const res = await fetch(`/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fieldId: field._id, slotId: selectedSlot.id, date: selectedDate })
            });
            if (!res.ok) throw new Error('booking failed');
            const json = await res.json();
            onBooked?.(json);
            alert('Booked!');
        } catch (err) {
            console.error(err);
            alert('Booking failed');
        }
    };

    const prevReview = () => setReviewIndex((i) => Math.max(0, i - 1));
    const nextReview = () => setReviewIndex((i) => Math.min(reviews.length - 1, i + 1));

    const coverImg = images[coverIndex] || images[0] || '';

    return (
        <main className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen pb-20`}>
            {/* Cover */}
            <section className={`relative h-64 sm:h-96 overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-b from-green-600 to-green-400'}`}>
                {coverImg ? (
                    <img src={coverImg} alt={field?.name} className="absolute inset-0 w-full h-full object-cover opacity-90" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold opacity-40">No cover</div>
                )}

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute left-6 bottom-6 text-white max-w-2xl">
                    <h1 className="text-2xl sm:text-4xl font-extrabold flex items-center gap-3">
                        {field?.name}
                        <span className="text-yellow-300 flex items-center gap-1 text-base">
                            <Star size={18} /> {field?.averageRating ?? '—'}
                        </span>
                    </h1>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 text-sm opacity-90">
                            <MapPin size={16} /> {field?.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm opacity-90">
                            <Clock size={16} /> {field?.openTime} - {field?.closeTime}
                        </div>
                    </div>
                </div>

                <button onClick={() => navigate(-1)} className="absolute left-4 top-4 bg-white/20 backdrop-blur rounded-full p-2">
                    <ArrowLeft size={18} className="text-white" />
                </button>

            </section>

            {/* Content grid */}
            <section className="container mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left / main */}
                <article className="lg:col-span-2 space-y-6">
                    {/* Image carousel thumbnails */}
                    <div className="flex gap-3">
                        <div className="flex-1 rounded-lg overflow-hidden shadow">
                            <img src={images[coverIndex] || images[0] || ''} alt="cover" className="w-full h-64 object-cover" />
                        </div>
                        <div className="w-32 hidden sm:grid grid-rows-3 gap-2">
                            {images.slice(0, 3).map((src, i) => (
                                <button key={i} onClick={() => setCoverIndex(i)} className="rounded overflow-hidden">
                                    <img src={src} alt={`thumb-${i}`} className="w-full h-20 object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description + tags */}
                    <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h3 className="text-lg font-bold">About</h3>
                        <p className="mt-2 text-sm opacity-90">{field?.description ?? 'No description provided.'}</p>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {(field?.tags || []).map((t, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-gray-700 dark:text-gray-200">{t}</span>
                            ))}
                        </div>
                    </div>

                    {/* Weather + facilities */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">Weather</h4>
                                <div className="text-sm opacity-80">{selectedDate}</div>
                            </div>
                            <div className="mt-3 flex items-center gap-4">
                                <div className="text-4xl">
                                    {weather?.icon === 'partly-cloudy' ? <><Sun size={24} /> <Cloud size={24} /></> : weather?.icon === 'rain' ? <CloudRain size={28} /> : <Sun size={28} />}
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{weather?.temp ?? '—'}°C</div>
                                    <div className="text-sm opacity-80">{weather?.condition ?? '—'}</div>
                                </div>
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <h4 className="font-semibold">Facilities</h4>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm opacity-90">
                                <div>{field?.nightLights ? '🌙 Night lights' : '—'}</div>
                                <div>{field?.bathrooms ? '🚻 Bathrooms' : '—'}</div>
                                <div>{field?.parking ? '🚗 Parking' : '—'}</div>
                                <div>{field?.changingRooms ? '🧥 Changing rooms' : '—'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews carousel */}
                    <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Reviews</h4>
                            <div className="flex items-center gap-2">
                                <button onClick={prevReview} className="p-2 rounded hover:bg-gray-200/50"><ChevronLeft /></button>
                                <button onClick={nextReview} className="p-2 rounded hover:bg-gray-200/50"><ChevronRight /></button>
                            </div>
                        </div>

                        <div className="mt-3">
                            {reviews.length === 0 ? (
                                <div className="text-sm opacity-80">No reviews yet — be the first to review!</div>
                            ) : (
                                <motion.div key={reviews[reviewIndex]?.id || reviewIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium">{reviews[reviewIndex]?.user?.firstName ?? 'Anonymous'}</div>
                                        <div className="flex items-center gap-1 text-yellow-400"><Star size={14} /> {reviews[reviewIndex]?.rating}</div>
                                    </div>
                                    <div className="text-sm opacity-90">{reviews[reviewIndex]?.text}</div>
                                    <div className="text-xs opacity-70">{new Date(reviews[reviewIndex]?.createdAt).toLocaleString()}</div>
                                </motion.div>
                            )}
                        </div>

                        {/* Add comment */}
                        <div className="mt-4 border-t pt-3">
                            <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." className="w-full p-2 rounded bg-gray-50 dark:bg-gray-700" />
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm">Rating:</label>
                                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="p-1 rounded bg-white dark:bg-gray-800">
                                        {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleAddComment}>Add Comment</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                </article>

                {/* Right / booking sidebar */}
                <aside className="space-y-6">
                    <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm opacity-80">Price</div>
                                <div className="text-2xl font-bold">{field?.pricing ? `${field.pricing} EGP` : '—'}</div>
                                <div className="text-sm opacity-70">/ hr</div>
                            </div>
                            <div>
                                <div className="text-sm opacity-80">Capacity</div>
                                <div className="text-lg font-medium">{field?.capacity ?? '—'}</div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="text-sm">Choose Date</label>
                            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-2 rounded mt-1 bg-gray-50 dark:bg-gray-700" />
                        </div>

                        <div className="mt-4">
                            <label className="text-sm">Available slots</label>
                            <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-auto">
                                {slots.map((s) => (
                                    <button key={s.id} onClick={() => setSelectedSlot(s)} className={`text-sm p-2 rounded ${selectedSlot?.id === s.id ? 'ring-2 ring-green-500' : ''} ${s.available ? 'bg-green-50 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-600/50 cursor-not-allowed'}`} disabled={!s.available}>
                                        <div className="font-medium">{s.label}</div>
                                        <div className="text-xs opacity-80">{s.price} EGP</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4">
                            <Button onClick={handleBook} className="w-full">Book Now</Button>
                        </div>

                        <div className="mt-3 text-xs opacity-70">By booking you agree to terms and availability. Cancellation policy applies.</div>
                    </div>

                    <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h4 className="font-semibold">Owner</h4>
                        <div className="mt-2 text-sm">
                            {field?.ownerId?.firstName ? (
                                <div>{field.ownerId.firstName} {field.ownerId.lastName}</div>
                            ) : (
                                <div>Owner info not available</div>
                            )}
                            <div className="text-xs opacity-70">{field?.ownerId?.email}</div>
                        </div>
                    </div>
                </aside>
            </section>
        </main>
    );
}
