import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Hardcoded Admin Credentials for Demo Purpose
        // In production, this should check against a backend endpoint
        if (username === "admin" && password === "admin123") {
            localStorage.setItem("user", JSON.stringify({ role: "admin", name: "Administrator" }));
            navigate("/admin");
        } else {
            setError("Invalid Admin Credentials");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
            <Link to="/" style={{ position: "absolute", top: "20px", left: "20px", color: "#ccc", textDecoration: "none" }}>← Back</Link>

            <div className="glass-container" style={{ maxWidth: "400px" }}>
                <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>🛡️ Admin Portal</h2>
                <p style={{ marginBottom: "30px", opacity: 0.7 }}>Restricted Access. Authorized Personnel Only.</p>

                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Admin Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        style={{ marginBottom: "15px" }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ marginBottom: "25px" }}
                    />

                    <button type="submit" style={{ width: "100%", background: "#ef4444" }}>
                        Access Dashboard
                    </button>
                </form>

                {error && <p className="error-message" style={{ marginTop: "20px" }}>{error}</p>}
            </div>
        </div>
    );
}
