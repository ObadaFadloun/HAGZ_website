// src/pages/Settings.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "../components/Sidebar";

import EditProfileSection from "../components/settings/EditProfileSection";
import UploadProfileSection from "../components/settings/UploadProfileSection";
import ChangePasswordSection from "../components/settings/ChangePasswordSection";
import BecomeOwnerSection from "../components/settings/BecomeOwnerSection";
import DeleteAccountSection from "../components/settings/DeleteAccountSection";

export default function Settings({ user, setUser, onLogout, darkMode, setDarkMode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"
        }`}
    >
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-20"
          } fixed top-0 left-0 h-full transition-all duration-300`}
      >
        <Sidebar
          user={user}
          onLogout={onLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-8 overflow-y-auto h-screen transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"
          }`}
      >
        <h1
          className={`text-3xl font-bold mb-8 ${darkMode ? "text-green-400" : "text-green-600"
            }`}
        >
          ⚙️ Settings
        </h1>

        <div className="space-y-8 max-w-3xl mx-auto">
          {/* Edit Profile Information */}
          <EditProfileSection user={user} setUser={setUser} darkMode={darkMode} />

          {/* Upload Profile Picture */}
          <UploadProfileSection user={user} setUser={setUser} darkMode={darkMode} />

          {/* Change Password */}
          <ChangePasswordSection user={user} setUser={setUser} darkMode={darkMode} />

          {/* Request to Become Owner */}
          {user.role === "player" && <BecomeOwnerSection user={user} setUser={setUser} darkMode={darkMode} />}

          {/* Danger Zone */}
          {user.role !== "admin" && <DeleteAccountSection user={user} setUser={setUser} darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
}
