import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user.role === "admin") {
                    navigate("/admin");
                }
            } catch (e) { console.error(e); }
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        // Hardcoded Admin Credentials for Demo Purpose
        if (username === "admin" && password === "admin123") {
            const adminUser = { role: "admin", name: "Administrator" };
            localStorage.setItem("user", JSON.stringify(adminUser));
            navigate("/admin"); // Redirect to Dashboard
        } else {
            setError("Invalid Admin Credentials");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#000", color: "#fff" }}>
            <Link to="/" style={{ position: "absolute", top: "20px", left: "20px", color: "#71767b", textDecoration: "none" }}>← Back to Home</Link>

            <div className="glass-container" style={{
                width: "400px",
                padding: "40px",
                background: "#16181c",
                border: "1px solid #2f3336",
                borderRadius: "16px"
            }}>
                <h2 style={{ fontSize: "2rem", marginBottom: "10px", textAlign: "center", color: "#f91880" }}>🛡️ Admin Portal</h2>
                <p style={{ marginBottom: "30px", color: "#71767b", textAlign: "center" }}>Restricted Access. Authorized Personnel Only.</p>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: "20px" }}>
                        <input
                            type="text"
                            placeholder="Admin Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            style={{
                                marginBottom: "15px",
                                width: "100%",
                                padding: "12px",
                                background: "#202327",
                                border: "1px solid #333",
                                borderRadius: "8px",
                                color: "white",
                                outline: "none"
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
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

                    <button type="submit" style={{
                        width: "100%",
                        padding: "15px",
                        background: "#ef4444",
                        color: "white",
                        fontWeight: "bold",
                        border: "none",
                        borderRadius: "30px",
                        cursor: "pointer",
                        fontSize: "1rem"
                    }}>
                        Access Dashboard
                    </button>

                    {error && <p className="error-message" style={{ marginTop: "20px", color: "#f4212e", textAlign: "center" }}>{error}</p>}
                </form>
            </div>
        </div>
    );
}
