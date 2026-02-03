import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="glass-container" style={{ textAlign: "center", maxWidth: "800px" }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Blockchain Voting System</h1>
            <p style={{ fontSize: "1.1rem", opacity: 0.8, marginBottom: "3rem" }}>
                Secure, Transparent, and Decentralized Elections
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>

                {/* Verification Portal Card */}
                <div style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "2rem",
                    borderRadius: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔐</div>
                    <h3 style={{ marginBottom: "1rem" }}>Voter Verification</h3>
                    <p style={{ opacity: 0.7, marginBottom: "1.5rem", flexGrow: 1 }}>
                        New here? Verify your identity and register your wallet to participate.
                    </p>
                    <Link to="/verify" style={{ width: "100%" }}>
                        <button style={{ width: "100%" }}>Go to Verification</button>
                    </Link>
                </div>

                {/* Voting Portal Card */}
                <div style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "2rem",
                    borderRadius: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗳️</div>
                    <h3 style={{ marginBottom: "1rem" }}>Voting Portal</h3>
                    <p style={{ opacity: 0.7, marginBottom: "1.5rem", flexGrow: 1 }}>
                        Already registered? Cast your vote securely on the blockchain.
                    </p>
                    <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                        <Link to="/login" style={{ flex: 1 }}>
                            <button style={{ width: "100%", background: "var(--secondary-color, #646cff)" }}>Login</button>
                        </Link>
                        <Link to="/vote" style={{ flex: 1 }}>
                            <button style={{ width: "100%", background: "transparent", border: "1px solid var(--secondary-color, #646cff)" }}>Quick Vote</button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
