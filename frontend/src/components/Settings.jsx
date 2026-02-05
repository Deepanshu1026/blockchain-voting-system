import React from "react";
import Sidebar from "./Sidebar";

export default function Settings() {
    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#121212", color: "white" }}>
            <Sidebar />
            <div style={{ marginLeft: "280px", padding: "40px", width: "100%" }}>
                <h1>Settings</h1>
                <div style={{ background: "#1e1e1e", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
                    <h3>Account Preferences</h3>
                    <p>Manage your account settings and preferences here.</p>
                    {/* Placeholder for settings controls */}
                    <div style={{ marginTop: "20px" }}>
                        <label style={{ display: "block", marginBottom: "10px" }}>
                            <input type="checkbox" style={{ marginRight: "10px" }} />
                            Enable Email Notifications
                        </label>
                        <label style={{ display: "block", marginBottom: "10px" }}>
                            <input type="checkbox" style={{ marginRight: "10px" }} />
                            Dark Mode (System Default)
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
