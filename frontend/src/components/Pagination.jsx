import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronFirst, ChevronLast } from "lucide-react";
import Button from "./Button";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const handleFirst = () => onPageChange(1);
    const handlePrev = () => onPageChange(Math.max(currentPage - 1, 1));
    const handleNext = () => onPageChange(Math.min(currentPage + 1, totalPages));
    const handleLast = () => onPageChange(totalPages);

    const baseStyle =
        "rounded p-2 text-white bg-green-600 transition-all duration-200 disabled:opacity-40";

    return (
        <motion.div
            className="flex justify-center items-center gap-3 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <Button
                onClick={handleFirst}
                disabled={currentPage === 1}
                className={`${baseStyle} ${currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer hover:bg-green-500"
                    }`}
            >
                <ChevronFirst />
            </Button>

            <Button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`${baseStyle} ${currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer hover:bg-green-500"
                    }`}
            >
                <ChevronLeft />
            </Button>

            <span className="text-sm opacity-80">
                Page {currentPage} of {totalPages}
            </span>

            <Button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`${baseStyle} ${currentPage === totalPages
                        ? "cursor-not-allowed"
                        : "cursor-pointer hover:bg-green-500"
                    }`}
            >
                <ChevronRight />
            </Button>

            <Button
                onClick={handleLast}
                disabled={currentPage === totalPages}
                className={`${baseStyle} ${currentPage === totalPages
                        ? "cursor-not-allowed"
                        : "cursor-pointer hover:bg-green-500"
                    }`}
            >
                <ChevronLast />
            </Button>
        </motion.div>
    );
}
