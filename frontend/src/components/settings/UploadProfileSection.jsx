import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Save, Upload,  } from "lucide-react";
import api from "../../utils/api";
import Button from "../Button";

export default function UploadProfileSection({ user, setUser, darkMode }) {
    const [uploadPicOpen, setUploadPicOpen] = useState(false);
    const [preview, setPreview] = useState(user.profileImage || null);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setIsUploading(false);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select an image first");
            return;
        }

        const formData = new FormData();
        formData.append("profileImage", file); // 👈 matches your MongoDB field name

        try {
            setIsUploading(true);

            const res = await api.patch("/users/updateProfilePicture", formData, {
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

            // Close section
            setUploadPicOpen(false);
            alert("Profile picture updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to upload profile picture");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <motion.div
            className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"
                }`}
        >
            <Button
                onClick={() => setUploadPicOpen(!uploadPicOpen)}
                className="flex justify-between items-center w-full text-left text-xl font-semibold mb-2 cursor-pointer"
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
                        {preview && (
                            <img
                                src={preview}
                                alt="Profile Preview"
                                className="w-24 h-24 rounded-full object-cover border-4 border-green-600"
                            />
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
                            disabled={isUploading}
                            className={`cursor-pointer flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition ${isUploading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            <Save size={18} />
                            {isUploading ? "Uploading..." : "Save Picture"}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
