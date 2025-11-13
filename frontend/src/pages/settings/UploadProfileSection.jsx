import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Save, Upload } from "lucide-react";
import api from "../../utils/api";
import Button from "../../components/Button";
import AlertModal from "../../components/AlertModal";

export default function UploadProfileSection({ user, setUser, darkMode }) {
    const [uploadPicOpen, setUploadPicOpen] = useState(false);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

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

    const showNotification = (message, title = "Notification") => {
        setAlert({ show: true, message, onConfirm: null, title });
    };

    // ✅ Update preview when user changes or when component opens
    useEffect(() => {
        if (user?.profileImage) {
            setPreview(user.profileImage);
        }
    }, [user?.profileImage, uploadPicOpen]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // ✅ Validate file type
        if (!selectedFile.type.startsWith('image/')) {
            showNotification("Please select a valid image file", "Validation Error");
            return;
        }

        // ✅ Validate file size (max 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            showNotification("Image size should be less than 5MB", "Validation Error");
            return;
        }

        setFile(selectedFile);
        setIsUploading(false);
        
        // ✅ Create preview from selected file
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
    };

    const handleUpload = async () => {
        if (!file) {
            showNotification("Please select an image first", "Validation Error");
            return;
        }

        const formData = new FormData();
        formData.append("profileImage", file);

        try {
            setIsUploading(true);

            const res = await api.patch("/users/update-profile-picture", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Depending on your API response structure
            const updatedUser = res.data?.user || res.data?.data?.user;
            if (!updatedUser) throw new Error("No user returned from API");

            // Merge updated fields with old user
            const mergedUser = { ...user, ...updatedUser };

            // Save to localStorage + React state
            localStorage.setItem("user", JSON.stringify(mergedUser));
            setUser(mergedUser);

            // ✅ Update preview with the new server URL
            if (updatedUser.profileImage) {
                setPreview(updatedUser.profileImage);
            }

            // Clean up blob URL if we were using one
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }

            // Reset file state
            setFile(null);
            
            // Show success message
            showNotification("Profile picture updated successfully!", "Success");

            // Close section after a short delay
            setTimeout(() => {
                setUploadPicOpen(false);
            }, 1500);

        } catch (err) {
            console.error(err);
            showNotification(
                err.response?.data?.message || "Failed to upload profile picture",
                "Error"
            );
        } finally {
            setIsUploading(false);
        }
    };

    // ✅ Clean up blob URLs when component unmounts
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    return (
        <motion.div
            className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"
                }`}
        >
            <Button
                onClick={() => setUploadPicOpen(!uploadPicOpen)}
                className="flex justify-between items-center w-full text-left text-xl font-semibold mb-2"
            >
                Upload Profile Picture
                {uploadPicOpen ? <ChevronUp /> : <ChevronDown />}
            </Button>

            <AnimatePresence>
                {uploadPicOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 overflow-hidden"
                    >
                        {/* ✅ Always show preview if available */}
                        {(preview || user?.profileImage) && (
                            <div className="flex flex-col items-center">
                                <img
                                    src={preview || user.profileImage}
                                    alt="Profile Preview"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-green-600"
                                />
                                <p className="text-xs mt-2 opacity-70">
                                    {file ? "Preview" : "Current Profile Picture"}
                                </p>
                            </div>
                        )}

                        <label
                            className={`flex items-center gap-3 cursor-pointer px-4 py-2 rounded-lg transition ${darkMode
                                ? "bg-gray-700 hover:bg-gray-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                }`}
                        >
                            <Upload size={18} />
                            <span>{file ? "Change Picture" : "Choose Picture"}</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        <Button
                            onClick={handleUpload}
                            disabled={isUploading || !file}
                            className={`flex items-center justify-center gap-2 rounded-lg ${isUploading || !file
                                    ? "bg-gray-400 cursor-not-allowed text-white"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                                }`}
                        >
                            <Save size={18} />
                            {isUploading ? "Uploading..." : "Save Picture"}
                        </Button>

                        {/* ✅ Show message when no file selected */}
                        {!file && (
                            <p className={`text-sm text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                No image selected
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ✅ Alert Modal */}
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