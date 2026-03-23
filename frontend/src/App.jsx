import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import VerificationFlow from "./components/VerificationFlow";
import VotingDashboard from "./components/VotingDashboard";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import LoginPage from "./components/LoginPage";
import ThemeToggle from "./components/ThemeToggle";
import NotificationCenter from "./components/NotificationCenter";
import EnhancedProfile from "./components/EnhancedProfile";

function App() {
    return (
        <Router>
            <div style={{ position: "relative", minHeight: "100vh" }}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/verify" element={<VerificationFlow />} />
                    <Route path="/vote" element={<VotingDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/profile" element={<EnhancedProfile />} />
                </Routes>
                
                {/* Global Components */}
                <ThemeToggle />
            </div>
        </Router>
    );
}

export default App;
