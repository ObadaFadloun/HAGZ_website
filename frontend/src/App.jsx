import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import AuthForm from "./pages/AuthForm";
import AdminDashboard from "./pages/AdminDashbourd";
import Footer from "./components/Footer";
import About from "./pages/About";
import ScrollToTop from "./components/ScrollToTop";
import Teams from "./pages/Teams";
import Offers from "./pages/Offers";
import Contact from "./pages/Contact";
import OwnerDashboard from "./pages/OwnerDashboard";
import PlayerDashboard from "./pages/PlayerDashboard";
import Settings from "./pages/Settings";
import ResetPasswordForm from "./pages/ResetPasswordForm";
import OwnerRequest from "./pages/OwnerRequests";
import AdminUsers from "./pages/AdminUsers";
import FootballFieldsPage from "./pages/FootballFields/FootballFieldsPage";
import BookingPage from "./pages/Booking/BookingPage";
import Reservations from "./pages/Booking/MyReservations";

function AppContent() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [isRestoring, setIsRestoring] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const hideLayout = location.pathname === "/auth";

  // 🌓 Persist dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // 🧭 Save last visited page (except auth)
  useEffect(() => {
    if (location.pathname !== "/auth") {
      localStorage.setItem("lastPage", location.pathname);
    }
  }, [location.pathname]);

  // 👤 Restore user and route
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const lastPage = localStorage.getItem("lastPage") || "/homepage";

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Stay on the same page after refresh
        if (location.pathname === "/" || location.pathname === "/dashboard") {
          navigate(lastPage, { replace: true });
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsRestoring(false);
  }, []);

  // 🔐 Handle authentication
  const handleAuth = (data) => {
    let userData, token;

    if (data.data && data.data.user) {
      userData = data.data.user;
      token = data.token;
    } else if (data.user) {
      userData = data.user;
      token = data.token;
    } else {
      userData = data;
      token = data.token || data.access_token;
    }

    if (userData && token) {
      setUser(userData);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Explicit redirect after login
      const redirectPage = "/dashboard";
      localStorage.setItem("lastPage", redirectPage);
      navigate(redirectPage, { replace: true });
    }
  };

  // 🚪 Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastPage");
    navigate("/homepage");
  };

  if (isRestoring) return null; // Prevent flicker during session restore

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && !user && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}

      <main className="flex-grow">
        <ScrollToTop />

        <Routes>
          <Route
            path="/homepage"
            element={!user ? <Homepage darkMode={darkMode} /> : <Navigate to={localStorage.getItem("lastPage") !== "/homepage" || "/dashboard"} />}
          />

          {/* <Route path="/football-fields" element={<FootballFieldsPage darkMode={darkMode} />} /> */}
          <Route path="/teams" element={<Teams darkMode={darkMode} />} />
          <Route path="/offers" element={<Offers darkMode={darkMode} />} />
          <Route path="/about" element={<About darkMode={darkMode} />} />
          <Route path="/contact" element={<Contact darkMode={darkMode} />} />

          <Route
            path="/auth"
            element={
              !user ? (
                <AuthForm onAuth={handleAuth} darkMode={darkMode} setDarkMode={setDarkMode} />
              ) : (
                <Navigate to={localStorage.getItem("lastPage") || "/dashboard"} />
              )
            }
          />
          <Route path="/resetPassword/:token" element={<ResetPasswordForm darkMode={darkMode} setDarkMode={setDarkMode} />} />


          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              user ? (
                user.role === "admin" ? (
                  <AdminDashboard
                    user={user}
                    onLogout={handleLogout}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                  />
                ) : user.role === "owner" ? (
                  <OwnerDashboard
                    user={user}
                    onLogout={handleLogout}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                  />
                ) : (
                  <PlayerDashboard
                    user={user}
                    onLogout={handleLogout}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                  />
                )
              ) : (
                <Navigate to="/auth" />
              )
            }
          />

          <Route path="/users" element={<AdminUsers darkMode={darkMode} setDarkMode={setDarkMode} />} />

          <Route path="/football-fields" element={<FootballFieldsPage user={user} darkMode={darkMode} setDarkMode={setDarkMode} />} />

          {/* SETTINGS */}
          <Route
            path="/settings"
            element={
              user ? (
                <Settings
                  user={user}
                  setUser={setUser}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/homepage" />
              )
            }
          />

          <Route path="/owner-requests" element={<OwnerRequest darkMode={darkMode} setDarkMode={setDarkMode} />} />

          <Route
            path="/book/:id"
            element={<BookingPage user={user} darkMode={darkMode} setDarkMode={setDarkMode} />}
          />

          <Route
            path="/reservations"
            element={<Reservations user={user} darkMode={darkMode} setDarkMode={setDarkMode} />}
          />

          {/* DEFAULT */}
          <Route path="/" element={<Navigate to="/homepage" replace />} />
          <Route path="*" element={<Navigate to="/homepage" replace />} />
        </Routes>
      </main>

      {!hideLayout && !user && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
