import { useState, useEffect } from "react";
import { getPolls } from "../services/api";
import { ethers } from "ethers";
import { votingContractAddress, votingContractABI } from "../config/contracts";
import { useNavigate } from "react-router-dom";

export default function VotingDashboard() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState({}); // loading state per poll
    const [activeTab, setActiveTab] = useState("overview");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
        } else {
            setUser(JSON.parse(storedUser));
        }
        loadPolls();
    }, []);

    const loadPolls = async () => {
        const data = await getPolls();
        setPolls(data);
    };

    const connectWallet = async () => {
        if (typeof window.ethereum === 'undefined') {
            alert("MetaMask is not detected!\n\n1. If you just installed it, please REFRESH the page.\n2. Ensure the extension is enabled.");
            return;
        }
        try {
            const output = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (output.length > 0) alert("Wallet Connected: " + output[0]);
        } catch (error) {
            console.error(error);
            alert("Connection failed: " + error.message);
        }
    };

    const castVote = async (pollId, candidateId) => {
        if (typeof window.ethereum === 'undefined') {
            return alert("MetaMask not detected!\n\nPlease REFRESH the page if you just installed it.");
        }

        try {
            setLoading(prev => ({ ...prev, [pollId]: true }));
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = new ethers.Contract(votingContractAddress, votingContractABI, signer);

            console.log(`Voting for candidate ${candidateId} in poll ${pollId}`);
            const tx = await contract.vote(pollId, candidateId);
            await tx.wait();

            alert("Vote Cast Successfully!");
        } catch (err) {
            console.error(err);
            alert("Voting Failed: " + (err.reason || err.message));
        }
        setLoading(prev => ({ ...prev, [pollId]: false }));
    };

    // User Sidebar Component
    const UserSidebar = () => {
        const menuItems = [
            { id: "overview", label: "Dashboard Guide", icon: "📘" },
            { id: "vote", label: "Active Elections", icon: "🗳️" },
            { id: "profile", label: "My Profile", icon: "👤" },
        ];

        return (
            <div style={{
                width: "260px",
                height: "100vh",
                background: "rgba(30, 30, 30, 0.95)",
                borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                left: 0,
                top: 0
            }}>
                <div style={{ marginBottom: "40px", paddingLeft: "10px" }}>
                    <h2 style={{ color: "white", margin: 0 }}>Voter Hub</h2>
                    <p style={{ color: "#666", fontSize: "0.8rem", margin: "5px 0 0 0" }}>Blockchain Voting System</p>
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                background: activeTab === item.id ? "var(--accent)" : "transparent",
                                color: activeTab === item.id ? "white" : "#aaa",
                                border: "none",
                                textAlign: "left",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "0.95rem",
                                fontWeight: activeTab === item.id ? "600" : "400",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                transition: "all 0.2s"
                            }}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div style={{ marginTop: "auto" }}>
                    <button
                        onClick={() => {
                            localStorage.removeItem("user");
                            navigate("/");
                        }}
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "#aaa",
                            width: "100%",
                            textAlign: "left",
                            padding: "12px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                            border: "none",
                            borderRadius: "8px"
                        }}
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="layout-container">
            <UserSidebar />

            <div className="main-content">
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>

                    {/* Header */}
                    <div style={{ marginBottom: "30px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                            <div>
                                <h1>
                                    {activeTab === 'overview' && "Voter Guide"}
                                    {activeTab === 'vote' && "Active Elections"}
                                    {activeTab === 'profile' && "My Profile"}
                                </h1>
                                <p style={{ margin: 0, opacity: 0.6 }}>Logged in as: {user && user.name ? user.name : "Verified Voter"}</p>
                            </div>
                            <button onClick={connectWallet} style={{ fontSize: "0.8rem", padding: "8px 15px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                                🔗 Check Wallet
                            </button>
                        </div>
                    </div>

                    {/* CONTENT - OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="glass-container">
                            <h3>👋 Welcome to BlockVote</h3>
                            <p style={{ lineHeight: "1.6" }}>
                                Your secure, blockchain-based voting dashboard. Here is how the process works:
                            </p>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "30px" }}>
                                <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px" }}>
                                    <h4 style={{ marginTop: 0, color: "var(--accent)" }}>1. Verify Identity</h4>
                                    <p style={{ fontSize: "0.9rem", color: "#888" }}>You have already completed the off-chain verification process using your government ID.</p>
                                    <div style={{ color: "#4ade80", fontSize: "0.85rem", marginTop: "10px" }}>✅ Verification Complete</div>
                                </div>
                                <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px" }}>
                                    <h4 style={{ marginTop: 0, color: "var(--accent)" }}>2. Connect Wallet</h4>
                                    <p style={{ fontSize: "0.9rem", color: "#888" }}>Your decentralized wallet (e.g. MetaMask) is linked to your voter profile for secure transactions.</p>
                                </div>
                                <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px" }}>
                                    <h4 style={{ marginTop: 0, color: "var(--accent)" }}>3. Cast Vote</h4>
                                    <p style={{ fontSize: "0.9rem", color: "#888" }}>Navigate to the <b>Active Elections</b> tab, select a candidate, and sign the transaction to cast your immutable vote.</p>
                                </div>
                                <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px" }}>
                                    <h4 style={{ marginTop: 0, color: "var(--accent)" }}>4. View Results</h4>
                                    <p style={{ fontSize: "0.9rem", color: "#888" }}>Once the election ends, results will be publicly verifiable on the blockchain ledger.</p>
                                </div>
                            </div>

                            <div style={{ marginTop: "30px", textAlign: "center" }}>
                                <button onClick={() => setActiveTab('vote')} style={{ padding: "12px 30px", fontSize: "1.1rem" }}>
                                    Start Voting Now →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* CONTENT - ACTIVE ELECTIONS */}
                    {activeTab === 'vote' && (
                        <div>
                            {polls.length === 0 && <div className="glass-container"><p>No active elections found.</p></div>}

                            {polls.map(poll => (
                                <div key={poll.id} className="glass-container" style={{ marginBottom: "30px" }}>
                                    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px", marginBottom: "20px" }}>
                                        <h2 style={{ margin: 0 }}>{poll.title}</h2>
                                        <p style={{ margin: "5px 0", opacity: 0.7 }}>{poll.description}</p>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
                                        {poll.candidates && poll.candidates.map(candidate => (
                                            <div key={candidate.id} style={{
                                                background: "rgba(255, 255, 255, 0.05)",
                                                padding: "15px",
                                                borderRadius: "10px",
                                                textAlign: "center",
                                                border: "1px solid rgba(255, 255, 255, 0.1)"
                                            }}>
                                                <img
                                                    src={candidate.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
                                                    alt={candidate.name}
                                                    style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "10px", objectFit: "cover" }}
                                                />
                                                <h3 style={{ margin: "5px 0", fontSize: "1.1rem" }}>{candidate.name}</h3>
                                                <p style={{ margin: "0 0 15px 0", opacity: 0.7, fontSize: "0.9rem" }}>{candidate.party}</p>

                                                <button
                                                    onClick={() => castVote(poll.id, candidate.id)}
                                                    disabled={loading[poll.id]}
                                                    style={{
                                                        width: "100%",
                                                        padding: "8px",
                                                        background: loading[poll.id] ? "#555" : "var(--secondary-color, #646cff)"
                                                    }}
                                                >
                                                    {loading[poll.id] ? "Voting..." : "Vote"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {(!poll.candidates || poll.candidates.length === 0) && (
                                        <p style={{ opacity: 0.5, fontStyle: "italic" }}>No candidates in this election yet.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CONTENT - PROFILE */}
                    {activeTab === 'profile' && user && (
                        <div className="glass-container" style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
                            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👤</div>
                            <h2 style={{ marginBottom: "0.5rem" }}>{user.name || "Verified Voter"}</h2>
                            <p style={{ opacity: 0.7, marginBottom: "2rem" }}>
                                Verified Voter Status
                            </p>

                            <div style={{ textAlign: "left", background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "12px", marginBottom: "30px" }}>
                                <div style={{ marginBottom: "15px" }}>
                                    <label style={{ fontSize: "0.8rem", opacity: 0.6, display: "block", marginBottom: "5px" }}>Voter ID Number</label>
                                    <div style={{ fontSize: "1.1rem", fontFamily: "monospace" }}>
                                        {user.id_number}
                                    </div>
                                </div>

                                <div style={{ marginBottom: "15px" }}>
                                    <label style={{ fontSize: "0.8rem", opacity: 0.6, display: "block", marginBottom: "5px" }}>Linked Wallet Address</label>
                                    <div style={{ fontSize: "0.9rem", fontFamily: "monospace", wordBreak: "break-all" }}>
                                        {user.wallet_address || "Not connected"}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: "0.8rem", opacity: 0.6, display: "block", marginBottom: "5px" }}>Account Status</label>
                                    <div style={{ color: "#4ade80", fontWeight: "bold", display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        ✅ Active & Verified
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
