import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaVoteYea,
    FaUserShield,
    FaCog,
    FaSignOutAlt,
    FaQuestionCircle,
    FaWallet
} from "react-icons/fa";
import { MdAdminPanelSettings, MdDashboard } from "react-icons/md";
import { useState, useEffect } from "react";
import "./Sidebar.css";

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("user");
            setUser(null);
            navigate("/login");
        }
    };

    const menuItems = [
        { name: "Home", path: "/", icon: <FaHome /> },
        { name: "Vote", path: "/vote", icon: <FaVoteYea /> },
        { name: "Verify Identity", path: "/verify", icon: <FaUserShield /> },
    ];

    const adminItems = [
        { name: "Admin Panel", path: "/admin", icon: <MdAdminPanelSettings /> },
    ];

    const otherItems = [
        { name: "Settings", path: "/settings", icon: <FaCog /> }, // Placeholder route
        { name: "Help & Support", path: "/help", icon: <FaQuestionCircle /> }, // Placeholder route
    ];

    return (
        <div className="sidebar-container">
            {/* Brand / Logo */}
            <div className="sidebar-brand">
                <div className="brand-logo">V</div>
                <div className="brand-text">BlockVote</div>
            </div>

            <nav className="nav-menu">
                <div className="section-label">Main Menu</div>
                {menuItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}

                <div className="nav-divider"></div>

                <div className="section-label">Management</div>
                {adminItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}

                <div className="nav-divider"></div>

                <div className="section-label">Preferences</div>
                {otherItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path} // Note: These routes might need to be created in App.jsx
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </nav>

            {/* User Profile Section */}
            {user ? (
                <div className="user-profile">
                    <div className="user-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="user-info">
                        <div className="user-name">{user.name || "User"}</div>
                        <div className="user-role">{user.role || "Voter"}</div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout} title="Logout">
                        <FaSignOutAlt />
                    </button>
                </div>
            ) : (
                <Link to="/login" className="nav-item" style={{ marginTop: "auto", justifyContent: "center", background: "var(--accent)", color: "white" }}>
                    <FaWallet />
                    <span>Connect / Login</span>
                </Link>
            )}
        </div>
    );
}
