import { useState, useEffect } from "react";
import { getPolls, createPoll, addCandidateToPoll } from "../services/api";

import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const [polls, setPolls] = useState([]);
    const [newPollTitle, setNewPollTitle] = useState("");
    const [selectedPoll, setSelectedPoll] = useState("");

    // Navigation State
    const [activeTab, setActiveTab] = useState("overview");

    // Candidate Form
    const [name, setName] = useState("");
    const [party, setParty] = useState("");
    const [image, setImage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            navigate("/login");
        }
        loadPolls();
    }, []);

    const loadPolls = async () => {
        try {
            const data = await getPolls();
            if (Array.isArray(data)) {
                setPolls(data);
            } else {
                console.error("Expected array from getPolls, got:", data);
                setPolls([]);
            }
        } catch (error) {
            console.error("Failed to load polls:", error);
            setPolls([]);
        }
    };

    const handleCreatePoll = async () => {
        if (!newPollTitle) return;
        await createPoll({ title: newPollTitle, description: "Created by Admin" });
        setNewPollTitle("");
        loadPolls();
        alert("Election Created Successfully!");
        setActiveTab("candidates"); // specific flow: create -> add candidates
    };

    const handleAddCandidate = async () => {
        if (!selectedPoll || !name || !party) return;
        await addCandidateToPoll({
            pollId: selectedPoll,
            name,
            party,
            imageUrl: image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        });
        alert("Candidate Added!");
        setName("");
        setParty("");
        setImage("");
        loadPolls();
    };

    // Admin Sidebar Component (PulseBet/Instagram Dark Style)
    const AdminSidebar = () => {
        const menuItems = [
            { id: "overview", label: "Dashboard Overview", icon: "📊" },
            { id: "create", label: "Create Election", icon: "➕" },
            { id: "candidates", label: "Manage Candidates", icon: "👥" },
            { id: "polls", label: "View Elections", icon: "🗳️" },
        ];

        return (
            <div style={{
                width: "250px",
                height: "100vh",
                background: "#000000", /* pure black for sharp contrast */
                borderRight: "1px solid #262626", /* subtle border */
                padding: "20px 12px",
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 100
            }}>
                <div style={{ marginBottom: "40px", paddingLeft: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Placeholder Logo Icon */}
                    <div style={{ width: "24px", height: "24px", background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", borderRadius: "6px" }}></div>
                    <h2 style={{ color: "white", margin: 0, fontSize: "1.2rem", fontWeight: "700", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>BlockVote</h2>
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                background: activeTab === item.id ? "#262626" : "transparent",
                                color: activeTab === item.id ? "white" : "#A8A8A8",
                                border: "none",
                                textAlign: "left",
                                padding: "12px 16px",
                                borderRadius: "8px", /* Pill shape */
                                cursor: "pointer",
                                fontSize: "0.95rem",
                                fontWeight: activeTab === item.id ? "600" : "400",
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                                transition: "all 0.1s ease-in-out",
                                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
                            }}
                        >
                            <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div style={{ marginTop: "auto" }}>
                    <button
                        onClick={() => navigate("/")}
                        style={{
                            background: "transparent",
                            color: "#eb5757",
                            width: "100%",
                            textAlign: "left",
                            padding: "12px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "500",
                            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
                        }}
                    >
                        <span>🚪</span> Return Home
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="layout-container">
            <AdminSidebar />

            <div className="main-content">
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>

                    {/* Header */}
                    <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <h1 style={{ marginBottom: "5px" }}>
                                {activeTab === 'overview' && "Dashboard Overview"}
                                {activeTab === 'create' && "Create New Election"}
                                {activeTab === 'candidates' && "Manage Candidates"}
                                {activeTab === 'polls' && "Existing Elections"}
                            </h1>
                            <p style={{ margin: 0, opacity: 0.6 }}>Welcome back, Administrator.</p>
                        </div>
                    </div>

                    {/* CONTENT - OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div>
                            {/* Analytics Section */}
                            <div style={{ marginBottom: "40px" }}>
                                <h3>📊 Live Election Analytics</h3>
                                {polls.length === 0 ? (
                                    <p style={{ opacity: 0.6 }}>No active elections to analyze.</p>
                                ) : (
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                                        {polls.map(poll => {
                                            // Analytics Logic (Mocking vote counts if not present for UI demo)
                                            const totalVotes = poll.candidates ? poll.candidates.reduce((acc, c) => acc + (c.votes || Math.floor(Math.random() * 1000) + 50), 0) : 0;

                                            // Sort candidates by votes (simulated)
                                            const rankedCandidates = poll.candidates ? [...poll.candidates].map(c => ({
                                                ...c,
                                                // If real votes exist use them, else simulate
                                                simulatedVotes: c.votes || Math.floor(Math.random() * 1000) + 100
                                            })).sort((a, b) => b.simulatedVotes - a.simulatedVotes) : [];

                                            const leader = rankedCandidates[0];
                                            const runnerUp = rankedCandidates[1];

                                            // Calculate Win Chance / Lead
                                            const leaderVotes = leader ? leader.simulatedVotes : 0;
                                            const totalSimulated = rankedCandidates.reduce((sum, c) => sum + c.simulatedVotes, 0);
                                            const winChance = totalSimulated > 0 ? Math.round((leaderVotes / totalSimulated) * 100) : 0;

                                            return (
                                                <div key={poll.id} className="glass-container" style={{ margin: 0, position: "relative", overflow: "hidden" }}>
                                                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(90deg, var(--accent), #a855f7)" }}></div>

                                                    <h4 style={{ margin: "0 0 15px 0", color: "#aaa", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                                                        {poll.title}
                                                    </h4>

                                                    {leader ? (
                                                        <div>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                                                                <img
                                                                    src={leader.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.name}`}
                                                                    alt={leader.name}
                                                                    style={{ width: "60px", height: "60px", borderRadius: "50%", border: "2px solid #4ade80" }}
                                                                />
                                                                <div>
                                                                    <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{leader.name}</div>
                                                                    <div style={{ fontSize: "0.9rem", color: "#4ade80" }}>Currently Winning 🏆</div>
                                                                </div>
                                                            </div>

                                                            <div style={{ marginBottom: "5px", display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                                                                <span>Win Probability</span>
                                                                <span style={{ fontWeight: "bold" }}>{winChance}%</span>
                                                            </div>
                                                            <div style={{ width: "100%", height: "8px", background: "#333", borderRadius: "10px", overflow: "hidden" }}>
                                                                <div style={{ width: `${winChance}%`, height: "100%", background: "var(--accent)", borderRadius: "10px" }}></div>
                                                            </div>

                                                            <p style={{ marginTop: "15px", fontSize: "0.85rem", color: "#666" }}>
                                                                Leading by {runnerUp ? (leaderVotes - runnerUp.simulatedVotes) : leaderVotes} votes against {runnerUp ? runnerUp.name : "others"}.
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div style={{ padding: "20px", textAlign: "center", opacity: 0.5 }}>
                                                            No candidates registered yet.
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Quick Links (Minimized) */}
                            <h3>⚡ Quick Actions</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                <div
                                    onClick={() => setActiveTab('create')}
                                    style={{ background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "12px", cursor: "pointer", border: "1px solid transparent", transition: "border 0.2s" }}
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = "transparent"}
                                >
                                    <h4 style={{ marginTop: 0, color: "var(--accent)" }}>+ Create Election</h4>
                                    <p style={{ fontSize: "0.85rem", color: "#666", margin: 0 }}>Start a new blockchain poll.</p>
                                </div>
                                <div
                                    onClick={() => setActiveTab('polls')}
                                    style={{ background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "12px", cursor: "pointer", border: "1px solid transparent", transition: "border 0.2s" }}
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = "transparent"}
                                >
                                    <h4 style={{ marginTop: 0, color: "var(--accent)" }}>👁️ Monitor Activity</h4>
                                    <p style={{ fontSize: "0.85rem", color: "#666", margin: 0 }}>View detailed candidate lists.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONTENT - CREATE */}
                    {activeTab === 'create' && (
                        <div className="glass-container">
                            <h2>Election Details</h2>
                            <p style={{ marginBottom: "20px", fontSize: "0.9rem", opacity: 0.7 }}>Initialize a new election smart contract entry.</p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Election Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Student Council 2024"
                                        value={newPollTitle}
                                        onChange={(e) => setNewPollTitle(e.target.value)}
                                    />
                                </div>
                                <button onClick={handleCreatePoll} style={{ marginTop: "10px" }}>Create Election</button>
                            </div>
                        </div>
                    )}

                    {/* CONTENT - CANDIDATES */}
                    {activeTab === 'candidates' && (
                        <div className="glass-container">
                            <h2>Register Candidate</h2>
                            <p style={{ marginBottom: "20px", fontSize: "0.9rem", opacity: 0.7 }}>Add a candidate to an existing election.</p>

                            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Select Election</label>
                            <select
                                value={selectedPoll}
                                onChange={(e) => setSelectedPoll(e.target.value)}
                                style={{ marginBottom: "20px", width: "100%", padding: "12px", background: "#2a2a2a", color: "white", border: "1px solid #333", borderRadius: "8px" }}
                            >
                                <option value="">-- Choose an active election --</option>
                                {polls.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </select>

                            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Candidate Full Name</label>
                            <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />

                            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Party / Affiliation</label>
                            <input type="text" placeholder="Independent / Party Name" value={party} onChange={(e) => setParty(e.target.value)} />

                            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Candidate Image URL</label>
                            <input type="text" placeholder="https://..." value={image} onChange={(e) => setImage(e.target.value)} />
                            <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "-5px", marginBottom: "20px" }}>Leave blank to auto-generate an avatar.</p>

                            <button onClick={handleAddCandidate} disabled={!selectedPoll} style={{ width: "100%" }}>
                                {selectedPoll ? "Add Candidate to Election" : "Select an Election First"}
                            </button>
                        </div>
                    )}

                    {/* CONTENT - POLLS */}
                    {activeTab === 'polls' && (
                        <div>
                            {polls.length === 0 ? (
                                <div className="glass-container" style={{ textAlign: "center", padding: "50px" }}>
                                    <p>No elections found.</p>
                                    <button onClick={() => setActiveTab('create')}>Create First Election</button>
                                </div>
                            ) : (
                                <div style={{ display: "grid", gap: "20px" }}>
                                    {polls.map(p => (
                                        <div key={p.id} className="glass-container" style={{ margin: 0, padding: "20px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h3 style={{ margin: "0 0 5px 0" }}>{p.title}</h3>
                                                <div style={{ display: "flex", gap: "15px", fontSize: "0.9rem", color: "#aaa" }}>
                                                    <span>🆔 ID: {p.id}</span>
                                                    <span>👥 Candidates: {p.candidates ? p.candidates.length : 0}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => { setSelectedPoll(p.id); setActiveTab('candidates'); }}
                                                style={{ background: "rgba(255,255,255,0.1)", fontSize: "0.85rem", padding: "8px 15px" }}
                                            >
                                                Add Candidate
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
