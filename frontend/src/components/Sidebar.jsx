import { Link, useLocation } from "react-router-dom";
import { FaHome, FaVoteYea, FaUserCheck, FaUserShield, FaTwitter } from "react-icons/fa";

export default function Sidebar({ role = "user" }) {
    const location = useLocation();

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

                {/* Admin Link for users (at bottom usually, but here within nav for visibility) */}
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

            {/* Profile Section (Mock) */}
            <div style={{
                marginTop: "auto",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                background: "transparent",
                borderRadius: "50px",
                cursor: "pointer"
            }}>
                <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#333",
                    marginRight: "12px"
                }}></div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: "bold", color: "#fff" }}>User</div>
                    <div style={{ fontSize: "0.85rem", color: "#71767b" }}>@voter</div>
                </div>
            </div>
        </div>
    );
}
