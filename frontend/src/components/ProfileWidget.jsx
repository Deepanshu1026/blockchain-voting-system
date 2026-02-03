import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileWidget() {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!user) return (
        <button
            onClick={() => navigate("/login")}
            style={{
                padding: "8px 16px",
                background: "#333",
                width: "auto",
                fontSize: "0.9rem"
            }}
        >
            Login
        </button>
    );

    return (
        <div style={{ position: "relative" }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#4f46e5",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    cursor: "pointer",
                    border: "2px solid #333"
                }}
            >
                {user.name ? user.name[0].toUpperCase() : "U"}
            </div>

            {isOpen && (
                <div style={{
                    position: "absolute",
                    top: "50px",
                    right: "0",
                    background: "#1e1e1e",
                    border: "1px solid #333",
                    padding: "15px",
                    borderRadius: "12px",
                    width: "200px",
                    zIndex: 1000,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
                }}>
                    <p style={{ margin: "0 0 5px 0", color: "white", fontWeight: "bold" }}>{user.id_number}</p>
                    <p style={{ margin: "0 0 15px 0", fontSize: "0.8rem", color: "#aaa", wordBreak: "break-all" }}>
                        {user.wallet_address || "No Wallet"}
                    </p>
                    <button
                        onClick={handleLogout}
                        style={{ background: "#ef4444", padding: "8px", fontSize: "0.8rem" }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
