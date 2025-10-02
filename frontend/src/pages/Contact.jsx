import Button from "../components/Button";
import Typewriter from "../components/Typewriter";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white py-20 px-6 md:px-12">

            {/* Title */}
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                    <Typewriter text="Get in Touch with HAGZ ✉️" speed={40} />
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Have a question, suggestion, or need support? We’re always here to help you.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                {/* Contact Form */}
                <form className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6 transform transition hover:scale-[1.01] hover:shadow-xl">
                    <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-600 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-600 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <textarea
                            placeholder="Write your message..."
                            rows="5"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-600 outline-none"
                        />
                    </div>
                    <Button
                        type="submit"
                    >
                        Send Message
                    </Button>
                </form>

                {/* Contact Info */}
                <div className="flex flex-col justify-center space-y-6 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-4">
                        <MapPin className="text-green-600" size={28} />
                        <span>123 Football St, Cairo, Egypt</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="text-green-600" size={28} />
                        <span>+20 123 456 789</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Mail className="text-green-600" size={28} />
                        <span>support@hagz.com</span>
                    </div>

                    <p className="mt-6 text-gray-600 dark:text-gray-400">
                        We’ll get back to you as soon as possible. Thank you for choosing <span className="font-bold text-green-600">HAGZ</span> ⚽
                    </p>
                </div>
            </div>
        </main>
    );
}
