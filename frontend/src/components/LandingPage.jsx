import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LandingPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) { console.error(e); }
        }
    }, []);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px"
        }}>

            {/* Navbar */}
            <nav style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 0"
            }}>
                <div style={{ fontSize: "1.5rem", fontWeight: "900", letterSpacing: "1px" }}>BLOCKVOTE</div>
                <div style={{ display: "flex", gap: "30px", fontSize: "0.9rem", color: "#ccc" }}>
                    <span>About</span>
                    <span>Technology</span>
                    <span>Security</span>
                    <span>Contact</span>
                </div>
                {/* Only show Admin Login if not logged in as admin */}
                {user?.role !== 'admin' && (
                    <Link to="/admin-login">
                        <button style={{
                            background: "#000",
                            border: "1px solid #333",
                            borderRadius: "20px",
                            padding: "10px 20px"
                        }}>
                            Admin Login
                        </button>
                    </Link>
                )}
            </nav>

            {/* Hero Section */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flex: 1,
                paddingBottom: "50px",
                flexWrap: "wrap",
                gap: "40px"
            }}>

                {/* Left Text */}
                <div style={{ flex: "1", minWidth: "300px" }}>
                    <h1 style={{
                        fontSize: "4.5rem",
                        lineHeight: "1.1",
                        marginBottom: "20px",
                        background: "linear-gradient(to right, #fff, #ccc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        The Future of <br />
                        <span style={{ color: "#fff", WebkitTextFillColor: "white" }}>Secure Voting</span>
                    </h1>
                    <p style={{ fontSize: "1.1rem", color: "#ccc", maxWidth: "450px", lineHeight: "1.6", marginBottom: "40px" }}>
                        Embrace the power of decentralized democracy. Built on Ethereum for transparent, tamper-proof, and verifiable elections.
                    </p>
                </div>

                {/* Right Card */}
                <div style={{
                    flex: "0 0 400px",
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "24px",
                    padding: "30px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                }}>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
                        {user ? `Welcome back, ${user.name || "Voter"}` : "Get Started"}
                    </h2>

                    {user ? (
                        <div style={{ marginBottom: "20px" }}>
                            <Link to={user.role === 'admin' ? "/admin" : "/vote"}>
                                <button style={{
                                    width: "100%",
                                    background: "#1d9bf0",
                                    color: "white",
                                    padding: "15px",
                                    borderRadius: "12px",
                                    fontWeight: "bold",
                                    fontSize: "1.1rem"
                                }}>
                                    Go to Dashboard →
                                </button>
                            </Link>
                            <button
                                onClick={() => { localStorage.removeItem("user"); setUser(null); }}
                                style={{
                                    width: "100%",
                                    background: "transparent",
                                    border: "1px solid #333",
                                    color: "#ff4444",
                                    padding: "15px",
                                    borderRadius: "12px",
                                    fontWeight: "bold",
                                    marginTop: "10px",
                                    cursor: "pointer"
                                }}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "8px" }}>New User?</label>
                                <Link to="/verify">
                                    <button style={{
                                        width: "100%",
                                        background: "rgba(255,255,255,0.1)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        padding: "15px",
                                        borderRadius: "12px",
                                        textAlign: "left",
                                        color: "white",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <span>Register / Verify ID</span>
                                        <span>→</span>
                                    </button>
                                </Link>
                            </div>

                            <div style={{ marginBottom: "30px" }}>
                                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "8px" }}>Already Registered?</label>
                                <Link to="/login">
                                    <button style={{
                                        width: "100%",
                                        background: "white",
                                        color: "black",
                                        padding: "15px",
                                        borderRadius: "12px",
                                        fontWeight: "bold"
                                    }}>
                                        Login to Vote
                                    </button>
                                </Link>
                            </div>
                        </>
                    )}

                    <p style={{ fontSize: "0.8rem", color: "#666", textAlign: "center" }}>
                        Secured by Blockchain Technology
                    </p>
                </div>
            </div>
        </div>
    );
}
