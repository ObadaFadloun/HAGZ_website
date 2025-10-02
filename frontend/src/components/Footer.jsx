export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-xl py-6 px-6 md:px-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                
                {/* Logo */}
                <h2 className="text-2xl font-bold tracking-wide cursor-pointer hover:scale-105 transform transition">
                    HAGZ
                </h2>

                {/* Links */}
                <div className="flex space-x-6 font-medium">
                    <a href="#" className="hover:text-green-300 transition">FAQ</a>
                    <a href="#" className="hover:text-green-300 transition">Terms</a>
                    <a href="#" className="hover:text-green-300 transition">Privacy</a>
                    <a href="#" className="hover:text-green-300 transition">Contact</a>
                </div>

                {/* Copy */}
                <p className="text-gray-200 text-sm">
                    &copy; {new Date().getFullYear()} <span className="font-semibold text-green-300">HAGZ</span>. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}
