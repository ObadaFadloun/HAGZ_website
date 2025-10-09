import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import Button from "../Button";
import api from "../../utils/api";

export default function ChangePasswordSection({ darkMode }) {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await api.patch("/users/updateMyPassword", {
        passwordCurrent: formData.currentPassword,
        password: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      // ✅ Update token and reload to refresh auth state
      localStorage.setItem("token", res.data.token);
      alert("Password updated successfully!");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setChangePasswordOpen(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        "Failed to update password. Please check your current password."
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
        className="flex justify-between items-center w-full text-left text-xl font-semibold mb-2 cursor-pointer"
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
              className={`cursor-pointer flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              <Lock size={18} /> {loading ? "Updating..." : "Update Password"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
