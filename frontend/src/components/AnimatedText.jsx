import { motion } from "framer-motion";

// Animation Variants
const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03, // delay between letters
        },
    },
};

const letter = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AnimatedText({ text, className }) {
    return (
        <motion.h2
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={className}
        >
            {text.split("").map((char, index) => (
                <motion.span key={index} variants={letter} className="inline-block">
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.h2>
    );
}