import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import api from "../../utils/api";
import Button from "../Button";

export default function DeleteAccountSection({ user, setUser, darkMode }) {
  const [dangerZoneOpen, setDangerZoneOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const res = await api.delete("/users/delete-me");

      if (res.status === 204) {
        alert("Your account has been deleted successfully.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/auth";
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete account.");
    } finally {
      setLoading(false);
    }
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
        className="cursor-pointer flex justify-between items-center w-full text-left text-xl font-semibold mb-2"
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
              className={`flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg transition 
              ${loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 cursor-pointer"
                }`}
            >
              <Trash2 size={18} />
              {loading ? "Deleting..." : "Delete Account"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
