import { useState } from "react";
import { login } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [idNumber, setIdNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await login(idNumber, password);
            if (res.success) {
                // Navigate to profile with user data
                navigate("/verify", { state: { user: res.user } });
            } else {
                setError(res.message || "Login failed");
            }
        } catch (err) {
            setError("Server error");
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <Link to="/" style={{ color: "white", textDecoration: "none", opacity: 0.7 }}>
                ← Back to Home
            </Link>

            <div className="glass-container" style={{ marginTop: "20px", maxWidth: "400px", margin: "40px auto" }}>
                <h2>🔑 Voter Login</h2>
                <p style={{ marginBottom: "20px", opacity: 0.8 }}>Enter your credentials to access your profile.</p>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem" }}>Aadhaar ID</label>
                        <input
                            type="text"
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            required
                            placeholder="Enter 12-digit ID"
                            style={{ width: "100%" }}
                        />
                    </div>

                    <div style={{ marginBottom: "25px" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem" }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            style={{ width: "100%" }}
                        />
                    </div>

                    <button type="submit" disabled={loading} style={{ width: "100%" }}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {error && <p className="error-message" style={{ marginTop: "15px" }}>{error}</p>}
                </form>

                <p style={{ marginTop: "20px", fontSize: "0.9rem" }}>
                    Not registered? <Link to="/verify" style={{ color: "#4ade80" }}>Verify ID here</Link>
                </p>
            </div>
        </div>
    );
}
