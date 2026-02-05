import React from "react";
import Sidebar from "./Sidebar";

export default function Help() {
    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#121212", color: "white" }}>
            <Sidebar />
            <div style={{ marginLeft: "280px", padding: "40px", width: "100%" }}>
                <h1>Help & Support</h1>
                <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
                    <div style={{ background: "#1e1e1e", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
                        <h3>How to Vote?</h3>
                        <p style={{ color: "#aaa" }}>Navigate to the "Vote" tab, select an active election, choose your candidate, and confirm the transaction with your wallet.</p>
                    </div>
                    <div style={{ background: "#1e1e1e", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
                        <h3>Verification Process</h3>
                        <p style={{ color: "#aaa" }}>Go to "Verify Identity" to upload your ID and complete the facial verification process to become an eligible voter.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
