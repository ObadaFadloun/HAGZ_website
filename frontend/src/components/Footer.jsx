export default function Footer() {
    return (
        <footer className="py-8 px-6 md:px-12 bg-green-600 font-bold text-gray-100 text-center">
            <p>&copy; {new Date().getFullYear()} HAGZ. All Rights Reserved.</p>
            <div className="flex justify-center space-x-6 mt-4">
                <a href="#" className="hover:text-white">FAQ</a>
                <a href="#" className="hover:text-white">Terms</a>
                <a href="#" className="hover:text-white">Privacy</a>
            </div>
        </footer>
    );
}
