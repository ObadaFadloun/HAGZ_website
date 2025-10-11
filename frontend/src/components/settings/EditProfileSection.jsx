// src/components/settings/EditProfileSection.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Save } from "lucide-react";
import Button from "../Button";
import api from "../../utils/api";

export default function EditProfileSection({ user, setUser, darkMode }) {
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [profile, setProfile] = useState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
    });

    const handleSaveProfile = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profile.email)) {
            alert("Please enter a valid email");
            return;
        }

        try {
            const res = await api.patch("/users/update-me", {
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
            });

            // ✅ Handle both possible response formats safely
            const updatedUser = res.data?.user || res.data?.data?.user;
            if (!updatedUser) {
                console.error("No user returned from API:", res.data);
                alert("Failed to update user — server returned unexpected data");
                return;
            }

            // ✅ Merge with existing user data
            const mergedUser = { ...user, ...updatedUser };

            // ✅ Update localStorage and React state
            localStorage.setItem("user", JSON.stringify(mergedUser));
            setUser(mergedUser);

            // ✅ Close the section
            setEditProfileOpen(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    return (
        <motion.div
            className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"
                }`}
        >
            <Button
                onClick={() => setEditProfileOpen(!editProfileOpen)}
                className="flex justify-between items-center w-full text-left text-xl font-semibold mb-2 cursor-pointer"
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
                            className="cursor-pointer flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            <Save size={18} /> Save Changes
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
