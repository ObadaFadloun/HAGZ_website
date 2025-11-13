import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import Button from "../../components/Button";
import AlertModal from "../../components/AlertModal";
import api from "../../utils/api";

export default function ChangePasswordSection({ darkMode }) {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      showNotification("Please fill in all fields", "Validation Error");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showNotification("New passwords do not match", "Validation Error");
      return;
    }

    try {
      setLoading(true);
      const res = await api.patch("/users/update-my-password", {
        passwordCurrent: formData.currentPassword,
        password: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      // ✅ Update token and reload to refresh auth state
      localStorage.setItem("token", res.data.token);
      showNotification("Password updated successfully!", "Success");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setChangePasswordOpen(false);

      // ✅ Reload after user sees the success message
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err) {
      console.error(err);
      showNotification(
        err.response?.data?.message ||
        "Failed to update password. Please check your current password.",
        "Error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={`p-6 rounded-xl shadow mt-6 ${darkMode ? "bg-gray-800" : "bg-white"
        }`}
    >
      <Button
        onClick={() => setChangePasswordOpen(!changePasswordOpen)}
        className="flex justify-between items-center w-full text-left text-xl font-semibold mb-2"
      >
        Change Password
        {changePasswordOpen ? <ChevronUp /> : <ChevronDown />}
      </Button>

      <AnimatePresence>
        {changePasswordOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Current Password"
              className={`w-full p-3 rounded-lg border ${darkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                : "bg-gray-50 border-gray-300 text-gray-800"
                }`}
            />
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className={`w-full p-3 rounded-lg border ${darkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                : "bg-gray-50 border-gray-300 text-gray-800"
                }`}
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm New Password"
              className={`w-full p-3 rounded-lg border ${darkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                : "bg-gray-50 border-gray-300 text-gray-800"
                }`}
            />

            <Button
              onClick={handleChangePassword}
              disabled={loading}
              className={`flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              <Lock size={18} /> {loading ? "Updating..." : "Update Password"}
            </Button>
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