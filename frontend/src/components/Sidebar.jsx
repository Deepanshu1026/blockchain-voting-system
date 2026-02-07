import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaVoteYea, FaUserCheck, FaUserShield, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Sidebar({ role = "user" }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user from local storage", e);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const userMenuItems = [
        { name: "Home", path: "/", icon: <FaHome size={24} /> },
        { name: "Vote", path: "/vote", icon: <FaVoteYea size={24} /> },
        { name: "Verify", path: "/verify", icon: <FaUserCheck size={24} /> },
    ];

    const adminMenuItems = [
        { name: "Dashboard", path: "/admin", icon: <FaUserShield size={24} /> },
    ];

    const menuItems = role === "admin" ? adminMenuItems : userMenuItems;

    return (
        <div style={{
            width: "275px",
            height: "100vh",
            background: "#000",
            borderRight: "1px solid #2f3336",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            left: 0,
            top: 0,
            padding: "10px 10px 20px 10px",
            boxSizing: "border-box",
            zIndex: 1000
        }}>
            {/* Logo Area */}
            <div style={{ padding: "10px 10px 20px 10px" }}>
                <Link to="/" style={{ color: "#fff", textDecoration: "none", fontSize: "1.8rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaVoteYea size={32} />
                    <span style={{ fontSize: "1.2rem" }}>BlockVote</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
                {menuItems.map(item => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "20px",
                                textDecoration: "none",
                                color: isActive ? "#fff" : "#e7e9ea",
                                padding: "12px 20px",
                                borderRadius: "30px",
                                fontWeight: isActive ? "700" : "400",
                                background: isActive ? "rgba(239, 243, 244, 0.1)" : "transparent",
                                fontSize: "1.2rem",
                                transition: "background 0.2s"
                            }}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    );
                })}

                {/* Admin Link for users - Only show if NOT logged in as admin already? Or always show? 
                    If user is logged in as 'user', show Admin Access link to login as admin.
                */}
                {role === "user" && (
                    <Link
                        to="/admin-login"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            textDecoration: "none",
                            color: "#e7e9ea",
                            padding: "12px 20px",
                            borderRadius: "30px",
                            fontSize: "1.2rem",
                            marginTop: "10px"
                        }}
                    >
                        <FaUserShield size={24} />
                        <span>Admin Access</span>
                    </Link>
                )}
            </nav>

            {/* Profile / Logout Section */}
            {user ? (
                <div
                    onClick={handleLogout}
                    title="Click to Logout"
                    style={{
                        marginTop: "auto",
                        padding: "12px",
                        display: "flex",
                        alignItems: "center",
                        background: "rgba(29, 155, 240, 0.1)",
                        borderRadius: "50px",
                        cursor: "pointer",
                        transition: "background 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 0, 0, 0.2)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "rgba(29, 155, 240, 0.1)"}
                >
                    <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "#333",
                        marginRight: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <FaUser size={20} color="#fff" />
                    </div>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: "bold", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {user.name || user.idNumber || "User"}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#666", display: "flex", alignItems: "center", gap: "5px" }}>
                            <FaSignOutAlt size={12} /> Log out @{user.role || "voter"}
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ marginTop: "auto", padding: "20px" }}>
                    <Link to="/login" style={{
                        display: "block",
                        width: "100%",
                        padding: "15px 0",
                        textAlign: "center",
                        background: "#1d9bf0",
                        color: "white",
                        borderRadius: "30px",
                        fontWeight: "bold",
                        textDecoration: "none",
                        fontSize: "1.1rem"
                    }}>
                        Login
                    </Link>
                    <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#666", marginTop: "10px" }}>
                        Don't have an ID? <Link to="/verify" style={{ color: "#1d9bf0" }}>Verify</Link>
                    </p>
                </div>
            )}
        </div>
    );
}
