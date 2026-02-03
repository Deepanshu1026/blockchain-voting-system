import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import VerificationFlow from "./components/VerificationFlow";
import VotingDashboard from "./components/VotingDashboard";
import AdminDashboard from "./components/AdminDashboard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/verify" element={<VerificationFlow />} />
                <Route path="/vote" element={<VotingDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
