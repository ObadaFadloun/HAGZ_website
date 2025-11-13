import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Button from "../../components/Button";
import AlertModal from "../../components/AlertModal";
import api from "../../utils/api";
import FieldFormSection from "./components/FieldFormSection";
import FieldFacilities from "./components/FieldFacilities";
import FieldAvailability from "./components/FieldAvailability";
import FieldExtras from "./components/FieldExtras";
import FieldPartnerships from "./components/FieldPartnerships";
import { ImagePlus } from "lucide-react";

export default function FieldForm({
    onAdded,
    onUpdated,
    editField,
    darkMode,
    user = null,
    setShowModal,
}) {
    const [form, setForm] = useState({
        _id: "",
        name: "",
        location: "",
        mapLink: "",
        pricing: "",
        ownerId: user?._id || "",
        bathrooms: false,
        changingRooms: false,
        nightLights: false,
        parking: false,
        capacity: 10,
        openTime: "08:00",
        closeTime: "22:00",
        closedDays: [],
        weatherIntegration: false,
        tags: [],
        video: "",
        partnerships: [],
        equipmentRentals: [],
        images: [],
    });

    const [removedImages, setRemovedImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState(null);
    const inputRef = useRef(null);
    const [previews, setPreviews] = useState([]);

    // ✅ Alert state
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

    // ✅ Simple notification function
    const showNotification = (message, title = "Notification") => {
        setAlert({ show: true, message, onConfirm: null, title });
    };

    // 🧩 Update form when editing
    useEffect(() => {
        if (editField && Object.keys(editField).length > 0) {
            setForm({
                _id: editField._id ?? "",
                name: editField.name ?? "",
                location: editField.location ?? "",
                mapLink: editField.mapLink ?? "",
                pricing: editField.pricing ?? "",
                ownerId: editField.ownerId ?? user?._id ?? "",
                bathrooms: !!editField.bathrooms,
                changingRooms: !!editField.changingRooms,
                nightLights: !!editField.nightLights,
                parking: !!editField.parking,
                capacity: editField.capacity ?? 10,
                openTime: editField.openTime ?? "08:00",
                closeTime: editField.closeTime ?? "22:00",
                closedDays: editField.closedDays ?? [],
                weatherIntegration: !!editField.weatherIntegration,
                tags: editField.tags ?? [],
                video: editField.video ?? "",
                partnerships: editField.partnerships ?? [],
                equipmentRentals: editField.equipmentRentals ?? [],
                images: editField.images ?? [],
            });

            // 🖼️ Create previews
            if (Array.isArray(editField.images)) {
                const baseURL = import.meta.env.VITE_API_URL || "";
                const imagePreviews = editField.images.map((img) => {
                    if (!img) return "";
                    if (typeof img === "string") {
                        if (img.startsWith("http")) return img;
                        return `${baseURL.replace(/\/$/, "")}/uploads/${img.replace(/^\/+/, "")}`;
                    }
                    if (typeof img === "object" && img.url) {
                        if (img.url.startsWith("http")) return img.url;
                        return `${baseURL.replace(/\/$/, "")}/uploads/${img.url.replace(/^\/+/, "")}`;
                    }
                    if (img instanceof File || img instanceof Blob) {
                        return URL.createObjectURL(img);
                    }
                    console.warn("⚠️ Unknown image type:", img);
                    return "";
                });
                setPreviews(imagePreviews.filter(Boolean));
            }
        }
    }, [editField, user?._id]);

    const handleChange = (patch) => setForm((prev) => ({ ...prev, ...patch }));

    const pickFiles = () => inputRef.current?.click();

    const handleFiles = (filesList) => {
        const files = Array.from(filesList);
        if (!files.length) return;

        // 🔹 Merge new files with existing ones
        setForm((prev) => ({
            ...prev,
            images: [...(prev.images || []), ...files],
        }));

        // 🔹 Add new previews
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newPreviews]);
    };

    // 🗑️ Remove image
    const removeAt = (i) => {
        setForm((prevForm) => {
            const currentImages = Array.isArray(prevForm.images) ? [...prevForm.images] : [];
            const removed = currentImages[i];

            // Track removed images only if they are URLs or existing DB entries
            if (typeof removed === "string") {
                setRemovedImages((prev) => [...prev, removed]);
            } else if (removed?.url) {
                setRemovedImages((prev) => [...prev, removed.url]);
            }

            // Remove that image
            const newImages = currentImages.filter((_, index) => index !== i);
            return { ...prevForm, images: newImages };
        });

        // 🔹 Sync previews after removal
        setPreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== i));
    };

    // 💾 Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);

            const formData = new FormData();
            const { images, ...rest } = form;

            formData.append("data", JSON.stringify(rest));
            formData.append("removedImages", JSON.stringify(removedImages));

            if (Array.isArray(images)) {
                images.forEach((img) => {
                    if (img instanceof File) {
                        formData.append("images", img);
                    }
                });
            }

            let res;
            if (editField?._id) {
                res = await api.patch(`/football-fields/${editField._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                onUpdated?.(res.data.data);

                showNotification("Field updated successfully!", "Success");

                setTimeout(() => {
                    setShowModal(false);
                }, 1000);

            } else {
                res = await api.post(`/football-fields`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                onAdded?.(res.data.data);

                showNotification("Field added successfully!", "Success");

                setTimeout(() => {
                    setShowModal(false);
                }, 1000);
            }
        } catch (err) {
            console.error("❌ Failed to submit field:", err);
            showNotification(err.response?.data?.message || "Something went wrong.", "Error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
        >
            <h2 className="text-xl font-semibold">
                {form._id ? "Edit Football Field" : "Add Football Field"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Info */}
                <FieldFormSection title="Basic Information" darkMode={darkMode}>
                    <div className="grid grid-cols-1 gap-3">
                        {["name", "location", "mapLink", "pricing"].map((field) => (
                            <input
                                key={field}
                                required
                                value={form[field] ?? ""}
                                onChange={(e) => handleChange({ [field]: e.target.value })}
                                placeholder={
                                    field === "mapLink"
                                        ? "Map link (URL)"
                                        : field === "pricing"
                                            ? "Pricing (e.g. 300 EGP / hr)"
                                            : `Field ${field}`
                                }
                                className={`p-3 rounded-lg border transition-all focus:ring-2 focus:outline-none ${darkMode
                                    ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-green-600"
                                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-green-500"
                                    }`}
                            />
                        ))}
                    </div>
                </FieldFormSection>

                {/* Images */}
                <div className="mb-4">
                    <label className="flex items-center gap-2 mb-2 font-semibold">Images</label>

                    <motion.div
                        onClick={pickFiles}
                        whileHover={{ scale: 1.02 }}
                        className="p-6 rounded-xl border-2 border-dashed border-green-300 text-center cursor-pointer"
                    >
                        <ImagePlus size={28} className="mx-auto text-green-600" />
                        <p className="text-sm mt-2">Click or drag images here (max 6)</p>
                    </motion.div>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        onChange={(e) => handleFiles(e.target.files)}
                    />

                    <div className="flex gap-3 mt-3 flex-wrap">
                        {previews.map((src, i) => (
                            <div key={i} className="w-24 h-24 rounded-lg overflow-hidden relative shadow">
                                <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
                                <Button
                                    type="button"
                                    onClick={(ev) => {
                                        ev.stopPropagation();
                                        removeAt(i);
                                    }}
                                    className="flex items-center justify-center absolute -top-2 -right-2 bg-white rounded-full mt-3 mr-3 w-5 h-5 shadow text-red-600"
                                >
                                    x
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Other Sections */}
                <FieldFacilities form={form} setForm={handleChange} darkMode={darkMode} />
                <FieldAvailability form={form} setForm={handleChange} darkMode={darkMode} />
                <FieldPartnerships
                    partnerships={form.partnerships}
                    setPartnerships={(p) => handleChange({ partnerships: p })}
                    darkMode={darkMode}
                />
                <FieldExtras form={form} setForm={handleChange} darkMode={darkMode} />

                {errors && <div className="text-red-400 font-medium text-sm mt-2">{errors}</div>}

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className={`${darkMode
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-gray-300 text-black hover:bg-gray-400"
                            }`}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting}
                        className={`${submitting
                            ? "opacity-60 cursor-not-allowed"
                            : darkMode
                                ? "bg-green-700 hover:bg-green-600 text-white"
                                : "bg-green-600 hover:bg-green-500 text-white"
                            }`}
                    >
                        {submitting ? "Saving..." : "Save Field"}
                    </Button>
                </div>
            </form>

            <AlertModal
                show={alert.show}
                message={alert.message}
                title={alert.title}
                onClose={closeAlert}
                onConfirm={alert.onConfirm}
                darkMode={darkMode}
            />
        </motion.div>
    );
}