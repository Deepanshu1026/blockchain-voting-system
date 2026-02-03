import { Link } from "react-router-dom";

export default function VoterProfile({ user }) {
    if (!user) return null;

    return (
        <div className="glass-container" style={{ textAlign: "center", maxWidth: "600px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👤</div>
            <h2 style={{ marginBottom: "0.5rem" }}>Voter Profile</h2>
            <p style={{ opacity: 0.7, marginBottom: "2rem" }}>
                Welcome back! You are verified and ready to vote.
            </p>

            <div style={{ textAlign: "left", background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "12px", marginBottom: "30px" }}>
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ fontSize: "0.8rem", opacity: 0.6, display: "block", marginBottom: "5px" }}>ID Number</label>
                    <div style={{ fontSize: "1.1rem", fontFamily: "monospace" }}>
                        {user.id_number ? `**** **** ${user.id_number.slice(-4)}` : "Verified ID"}
                    </div>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ fontSize: "0.8rem", opacity: 0.6, display: "block", marginBottom: "5px" }}>Wallet Address</label>
                    <div style={{ fontSize: "0.9rem", fontFamily: "monospace", wordBreak: "break-all" }}>
                        {user.wallet_address || "Connected"}
                    </div>
                </div>

                <div>
                    <label style={{ fontSize: "0.8rem", opacity: 0.6, display: "block", marginBottom: "5px" }}>Status</label>
                    <div style={{ color: "#4ade80", fontWeight: "bold" }}>
                        ✅ Verified & Registered
                    </div>
                </div>
            </div>

            <Link to="/vote">
                <button style={{ width: "100%", background: "var(--secondary-color, #646cff)" }}>
                    Go to Voting Portal
                </button>
            </Link>
        </div>
    );
}
