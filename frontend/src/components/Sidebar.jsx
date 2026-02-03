import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { name: "Home", path: "/" },
        { name: "Vote", path: "/vote" },
        { name: "Verify", path: "/verify" },
        { name: "Admin", path: "/admin" },
    ];

    return (
        <div style={{
            width: "250px",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.3)", // Transparent
            backdropFilter: "blur(10px)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
            position: "fixed",
            left: 0,
            top: 0
        }}>
            <h2 style={{ color: "white", marginBottom: "40px", paddingLeft: "10px" }}>BlockVote</h2>

            <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {menuItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            textDecoration: "none",
                            color: location.pathname === item.path ? "white" : "#aaa",
                            padding: "12px 16px",
                            borderRadius: "8px",
                            background: location.pathname === item.path ? "#333" : "transparent",
                            fontWeight: location.pathname === item.path ? "bold" : "normal",
                            transition: "all 0.2s"
                        }}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
