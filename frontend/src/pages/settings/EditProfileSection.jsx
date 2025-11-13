import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Save } from "lucide-react";
import Button from "../../components/Button";
import AlertModal from "../../components/AlertModal";
import api from "../../utils/api";

export default function EditProfileSection({ user, setUser, darkMode }) {
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [profile, setProfile] = useState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
    });
    const [loading, setLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

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

    // ✅ Check if there are changes compared to original user data
    useEffect(() => {
        const hasFirstNameChanged = profile.firstName !== user.firstName;
        const hasLastNameChanged = profile.lastName !== user.lastName;
        const hasEmailChanged = profile.email !== user.email;

        setHasChanges(hasFirstNameChanged || hasLastNameChanged || hasEmailChanged);
    }, [profile, user]);

    const handleSaveProfile = async () => {
        // ✅ Double check if there are changes (in case user spams the button)
        if (!hasChanges) {
            showNotification("No changes detected to save", "Info");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profile.email)) {
            showNotification("Please enter a valid email", "Validation Error");
            return;
        }

        try {
            setLoading(true);
            const res = await api.patch("/users/update-me", {
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
            });

            // ✅ Handle both possible response formats safely
            const updatedUser = res.data?.user || res.data?.data?.user;
            if (!updatedUser) {
                console.error("No user returned from API:", res.data);
                showNotification("Failed to update user — server returned unexpected data", "Error");
                return;
            }

            // ✅ Merge with existing user data
            const mergedUser = { ...user, ...updatedUser };

            // ✅ Update localStorage and React state
            localStorage.setItem("user", JSON.stringify(mergedUser));
            setUser(mergedUser);

            // ✅ Close the section and show success message
            setEditProfileOpen(false);
            showNotification("Profile updated successfully!", "Success");
        } catch (err) {
            console.error(err);
            showNotification(
                err.response?.data?.message || "Failed to update profile",
                "Error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"
                }`}
        >
            <Button
                onClick={() => setEditProfileOpen(!editProfileOpen)}
                className="flex justify-between items-center w-full text-left text-xl font-semibold mb-2"
            >
                Edit Profile Info
                {editProfileOpen ? <ChevronUp /> : <ChevronDown />}
            </Button>

            <AnimatePresence>
                {editProfileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 overflow-hidden"
                    >
                        <input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) =>
                                setProfile({ ...profile, firstName: e.target.value })
                            }
                            placeholder="First Name"
                            className={`w-full p-3 rounded-lg border ${darkMode
                                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                                : "bg-gray-50 border-gray-300 text-gray-800"
                                }`}
                        />
                        <input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) =>
                                setProfile({ ...profile, lastName: e.target.value })
                            }
                            placeholder="Last Name"
                            className={`w-full p-3 rounded-lg border ${darkMode
                                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                                : "bg-gray-50 border-gray-300 text-gray-800"
                                }`}
                        />
                        <input
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                                setProfile({ ...profile, email: e.target.value })
                            }
                            placeholder="Email"
                            className={`w-full p-3 rounded-lg border ${darkMode
                                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                                : "bg-gray-50 border-gray-300 text-gray-800"
                                }`}
                        />

                        <Button
                            onClick={handleSaveProfile}
                            disabled={loading || !hasChanges}
                            className={`flex items-center justify-center gap-2 rounded-lg ${loading || !hasChanges
                                    ? "bg-gray-400 cursor-not-allowed text-white"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                                }`}
                        >
                            <Save size={18} />
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>

                        {/* ✅ Show message when no changes */}
                        {!hasChanges && (
                            <p className={`text-sm text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                No changes made to save
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