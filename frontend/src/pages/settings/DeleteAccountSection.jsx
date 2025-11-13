import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import api from "../../utils/api";
import Button from "../../components/Button";
import AlertModal from "../../components/AlertModal";

export default function DeleteAccountSection({ user, setUser, darkMode }) {
  const [dangerZoneOpen, setDangerZoneOpen] = useState(false);
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

  const handleDelete = async () => {
    showAlert(
      "Are you sure you want to delete your account? This action cannot be undone.",
      async () => {
        try {
          setLoading(true);
          const res = await api.delete("/users/delete-me");

          if (res.status === 204) {
            // ✅ Clear local storage and redirect immediately after successful deletion
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            
            // ✅ Show success message briefly, then redirect
            showNotification("Your account has been deleted successfully.", "Account Deleted");
            
            // ✅ Redirect after user sees the success message
            setTimeout(() => {
              window.location.href = "/auth";
            }, 1500);
            
          } else {
            showNotification("Something went wrong. Please try again later.", "Error");
          }
        } catch (err) {
          console.error(err);
          showNotification(err.response?.data?.message || "Failed to delete account.", "Error");
        } finally {
          setLoading(false);
        }
      },
      "Confirm Account Deletion"
    );
  };

  return (
    <motion.div
      className={`cursor-pointer p-6 rounded-xl shadow border ${darkMode
        ? "bg-red-900 border-red-700 text-red-300"
        : "bg-red-100 border-red-300 text-red-600"
        }`}
    >
      <Button
        onClick={() => setDangerZoneOpen(!dangerZoneOpen)}
        className="flex justify-between items-center w-full text-left text-xl font-semibold mb-2"
      >
        Delete Account
        {dangerZoneOpen ? <ChevronUp /> : <ChevronDown />}
      </Button>

      <AnimatePresence>
        {dangerZoneOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            <p className="text-sm">
              Deleting your account is permanent and cannot be undone.
            </p>

            <Button
              onClick={handleDelete}
              disabled={loading}
              className={`flex items-center justify-center gap-2 text-white rounded-lg
              ${loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
                }`}
            >
              <Trash2 size={18} />
              {loading ? "Deleting..." : "Delete Account"}
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