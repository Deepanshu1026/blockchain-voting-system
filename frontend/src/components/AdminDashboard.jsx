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

    // Admin Sidebar Component
    const AdminSidebar = () => {
        const menuItems = [
            { id: "overview", label: "Dashboard Overview", icon: "📊" },
            { id: "create", label: "Create Election", icon: "➕" },
            { id: "candidates", label: "Manage Candidates", icon: "👥" },
            { id: "polls", label: "View Elections", icon: "🗳️" },
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
                    <h2 style={{ color: "white", margin: 0 }}>Admin Panel</h2>
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
                        onClick={() => navigate("/")}
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "#aaa",
                            width: "100%",
                            textAlign: "left",
                            padding: "12px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >
                        🏠 Return Home
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
                        <div className="glass-container">
                            <h3>👋 Getting Started</h3>
                            <p style={{ lineHeight: "1.6" }}>
                                This specific dashboard is designed for election officials to manage the voting process securely on the blockchain.
                            </p>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "30px" }}>
                                <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px" }}>
                                    <h4 style={{ marginTop: 0, color: "var(--accent)" }}>1. Create Election</h4>
                                    <p style={{ fontSize: "0.9rem", color: "#888" }}>Define a new voting event. Set the title and description to initialize it on the smart contract.</p>
                                </div>
                                <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px" }}>
                                    <h4 style={{ marginTop: 0, color: "var(--accent)" }}>2. Add Candidates</h4>
                                    <p style={{ fontSize: "0.9rem", color: "#888" }}>Register candidates for specific elections. You can upload images and set party affiliations.</p>
                                </div>
                                <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px" }}>
                                    <h4 style={{ marginTop: 0, color: "var(--accent)" }}>3. Monitor Voting</h4>
                                    <p style={{ fontSize: "0.9rem", color: "#888" }}>Track real-time vote counts and participation directly from the "View Elections" tab.</p>
                                </div>
                                <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px" }}>
                                    <h4 style={{ marginTop: 0, color: "var(--accent)" }}>4. Security</h4>
                                    <p style={{ fontSize: "0.9rem", color: "#888" }}>All actions are recorded on the blockchain for transparency and immutability.</p>
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
