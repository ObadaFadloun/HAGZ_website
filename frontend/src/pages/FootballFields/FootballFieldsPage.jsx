import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, MapPin, Sun, Moon, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";

import api from "../../utils/api";
import noFootballFields from "../../assets/EmptyState.json";

import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import Modal from "../../components/Modal";
import AlertModal from "../../components/AlertModal";
import FieldForm from "./FieldForm";
import FieldCard from "./components/FieldCard";
import SearchAndFilterBar from "./components/SearchAndFilterBar";
import LoadingScreen from "../../components/LoadingScreen";

export default function FootballFieldsPage({ user, darkMode, setDarkMode }) {
    const navigate = useNavigate();

    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        nightLights: false,
        bathrooms: false,
        parking: false,
        changingRooms: false,
    });
    const [showModal, setShowModal] = useState(false);
    const [showMyFields, setShowMyFields] = useState(false);
    const [editField, setEditField] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

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

    const fieldsPerPage = 6;

    // ✅ 1. Publicly fetch fields — no token required
    const fetchFields = async () => {
        try {
            setLoading(true);
            const res = await api.get("/football-fields");
            const data = res.data?.data?.fields || res.data?.data || [];
            setFields(data);
        } catch (err) {
            console.error("❌ Error fetching fields:", err);
            showNotification("Failed to load football fields", "Error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFields();
    }, []);

    // ✅ Editing logic (requires auth)
    const handleEditField = async (field) => {
        try {
            const res = await api.get(`/football-fields/${field._id}`);
            const payload = res.data?.data?.field ?? res.data?.data ?? res.data;
            setEditField(payload);
            setShowModal(true);
        } catch (err) {
            console.error("❌ Failed to fetch field for edit:", err);
            showNotification("Failed to load field for editing", "Error");
        }
    };

    // ✅ Refresh fields after add/update
    const handleAddField = async () => {
        await fetchFields();
        setShowModal(false);
        showNotification("Field added successfully!", "Success");
    };

    const handleUpdateField = async () => {
        await fetchFields();
        setEditField(null);
        setShowModal(false);
        showNotification("Field updated successfully!", "Success");
    };

    // ✅ Delete field (requires auth)
    const handleDeleteField = async (id) => {
        showAlert(
            "🗑️ Are you sure you want to delete this field?",
            async () => {
                try {
                    await api.delete(`/football-fields/${id}`);
                    setFields((prev) => prev.filter((field) => field._id !== id));
                    showNotification("Field deleted successfully!", "Success");
                } catch (err) {
                    console.error("❌ Failed to delete field:", err);
                    showNotification("Failed to delete the field. Please try again.", "Error");
                }
            },
            "Confirm Deletion"
        );
    };

    // ✅ Filter fields
    const filteredFields = fields.filter((field) => {
        const matchesSearch =
            field.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            field.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(field.pricing)?.includes(searchTerm);

        const matchesFilters =
            (!filters.nightLights || field.nightLights) &&
            (!filters.bathrooms || field.bathrooms) &&
            (!filters.parking || field.parking) &&
            (!filters.changingRooms || field.changingRooms);

        const matchesMyFields = !showMyFields || field.isOwnedByCurrentUser;

        return matchesSearch && matchesFilters && matchesMyFields;
    });

    const totalPages = Math.ceil(filteredFields.length / fieldsPerPage);
    const indexOfLast = currentPage * fieldsPerPage;
    const indexOfFirst = indexOfLast - fieldsPerPage;
    const currentFields = filteredFields.slice(indexOfFirst, indexOfLast);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
    };

    if (loading) {
        return <LoadingScreen darkMode={darkMode} message="Loading Football Fields..." />
    }

    return (
        <main className={`min-h-screen overflow-y-auto pb-24 px-4 sm:px-6 md:px-8 transition-all duration-300 ${user ? '' : 'pt-30'} ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
            {user && (<motion.div
                className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 mt-8 text-center sm:text-left"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >

                <Button onClick={() => navigate("/dashboard")} className={`flex items-center justify-center gap-2 px-4 w-full sm:w-auto rounded-full shadow-md ${darkMode ? "bg-green-600 hover:bg-green-500 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}>
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Button>


                <h1 className={`text-2xl sm:text-3xl font-bold flex items-center justify-center gap-3 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                    <MapPin size={28} />
                    Football Fields
                </h1>

                <motion.div whileHover={{ rotate: 20 }} whileTap={{ scale: 0.9 }}>
                    <Button onClick={() => setDarkMode(!darkMode)} className={`rounded-full shadow-md ${darkMode ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white" : "bg-gradient-to-br from-gray-800 to-gray-900 text-yellow-300"}`}>
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </Button>
                </motion.div>
            </motion.div>)}

            {user && (
                <div className="mb-6">
                    <SearchAndFilterBar
                        user={user}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filters={filters}
                        setFilters={setFilters}
                        showMyFields={showMyFields}
                        setShowMyFields={setShowMyFields}
                        darkMode={darkMode}
                    />
                </div>
            )}

            {/* ✅ Only admins/owners can add new fields */}
            {user && user.role !== "player" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex justify-center sm:justify-end mb-6">
                    <Button
                        onClick={() => {
                            setEditField(null);
                            setShowModal(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-5 py-3 rounded-lg shadow-lg w-full sm:w-auto"
                    >
                        <PlusCircle size={20} />
                        Add Football Field
                    </Button>
                </motion.div>
            )}

            {currentFields.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center mt-20">
                    <Lottie animationData={noFootballFields} loop className="w-52 h-52 sm:w-64 sm:h-64" />
                    <p className="text-base sm:text-lg font-semibold opacity-80 mt-4">No football fields found.</p>
                    <Button className="mt-6 text-white bg-gradient-to-r from-green-600 to-green-800 font-bold hover:shadow-xl" onClick={() => fetchFields()}>
                        Refresh Page
                    </Button>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {currentFields.map((field, i) => (
                        <FieldCard
                            key={field._id || i}
                            user={user}
                            field={field}
                            darkMode={darkMode}
                            onEdit={handleEditField}
                            onDelete={handleDeleteField}
                        />
                    ))}
                </motion.div>
            )}

            <div className="flex justify-center mt-10 mb-10">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>

            {user && (
                <Modal show={showModal} setShowModal={setShowModal} darkMode={darkMode}>
                    <FieldForm
                        onAdded={handleAddField}
                        onUpdated={handleUpdateField}
                        editField={editField}
                        darkMode={darkMode}
                        user={user}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )}

            {/* ✅ Alert Modal */}
            <AlertModal
                show={alert.show}
                message={alert.message}
                title={alert.title}
                onClose={closeAlert}
                onConfirm={alert.onConfirm}
                darkMode={darkMode}
            />
        </main>
    );
}