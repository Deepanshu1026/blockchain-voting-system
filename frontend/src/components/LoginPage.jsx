import { useState, useEffect } from "react";
import { login } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [idNumber, setIdNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            navigate("/vote");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await login(idNumber, password);
            if (res.success) {
                // Ensure name is stored
                const userData = { ...res.user, name: res.user.name || "Voter" };
                localStorage.setItem("user", JSON.stringify(userData));
                navigate("/vote");
            } else {
                setError(res.message || "Invalid credentials");
            }
        } catch (err) {
            console.error(err);
            setError("Server error. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#000", color: "#fff", alignItems: "center", justifyContent: "center" }}>
            <Link to="/" style={{ position: "absolute", top: "20px", left: "20px", color: "#ccc", textDecoration: "none" }}>
                ← Back to Home
            </Link>

            <div className="glass-container" style={{
                width: "400px",
                padding: "40px",
                background: "#16181c",
                border: "1px solid #2f3336",
                borderRadius: "16px"
            }}>
                <h2 style={{ fontSize: "2rem", marginBottom: "10px", textAlign: "center" }}>🔑 Voter Login</h2>
                <p style={{ marginBottom: "30px", color: "#71767b", textAlign: "center" }}>Enter your credentials to access your profile.</p>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "#e7e9ea" }}>Aadhaar ID</label>
                        <input
                            type="text"
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            required
                            placeholder="Enter 12-digit ID"
                            style={{
                                width: "100%",
                                padding: "12px",
                                background: "#202327",
                                border: "1px solid #333",
                                borderRadius: "8px",
                                color: "white",
                                outline: "none"
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "30px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "#e7e9ea" }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            style={{
                                width: "100%",
                                padding: "12px",
                                background: "#202327",
                                border: "1px solid #333",
                                borderRadius: "8px",
                                color: "white",
                                outline: "none"
                            }}
                        />
                    </div>

                    <button type="submit" disabled={loading} style={{
                        width: "100%",
                        padding: "15px",
                        background: loading ? "#333" : "#1d9bf0",
                        color: "white",
                        fontWeight: "bold",
                        border: "none",
                        borderRadius: "30px",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: "1rem"
                    }}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {error && <p className="error-message" style={{ marginTop: "20px", color: "#f4212e", textAlign: "center" }}>{error}</p>}
                </form>

                <p style={{ marginTop: "30px", fontSize: "0.9rem", textAlign: "center", color: "#71767b" }}>
                    Not registered? <Link to="/verify" style={{ color: "#1d9bf0", textDecoration: "none" }}>Verify ID here</Link>
                </p>
            </div>
        </div>
    );
}
