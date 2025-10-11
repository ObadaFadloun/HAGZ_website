import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Crown } from "lucide-react";
import Button from "../Button";
import api from "../../utils/api";

export default function BecomeOwnerSection({ user, setUser, darkMode }) {
  const [becomeOwnerOpen, setBecomeOwnerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(user?.ownerRequestStatus === "pending");

  const handleRequest = async () => {
    if (requested) return;

    try {
      setLoading(true);
      const res = await api.post("/owner-requests/become-owner");

      if (res.data.status === "success") {
        alert("Your request to become an owner has been sent!");

        const newUser = res.data.user;
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        setRequested(newUser.ownerRequestStatus === "pending");
        setBecomeOwnerOpen(false);
      } else {
        alert("Something went wrong. Try again later.");
      }
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        "Failed to send request. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={`p-6 rounded-xl shadow mt-6  ${darkMode
        ? "bg-yellow-500 border-yellow-300 text-yellow-50"
        : "bg-yellow-100 border-yellow-300 text-yellow-600"
        }`}
    >
      <Button
        onClick={() => setBecomeOwnerOpen(!becomeOwnerOpen)}
        className={`flex justify-between items-center w-full text-left text-xl font-semibold mb-2 cursor-pointer`}
      >
        Become an Owner
        {becomeOwnerOpen ? <ChevronUp /> : <ChevronDown />}
      </Button>

      <AnimatePresence>
        {becomeOwnerOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            <p
              className={`text-sm ${darkMode ? "text-gray-800" : "text-gray-600"
                }`}
            >
              Click the button below to send a request to become a verified
              field owner. An admin will review your request soon.
            </p>

            <Button
              onClick={handleRequest}
              disabled={loading || requested}
              className={`flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg transition 
              ${requested
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
                }`}
            >
              <Crown size={18} />
              {loading
                ? "Sending..."
                : requested
                  ? "Request Sent"
                  : "Send Request"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
