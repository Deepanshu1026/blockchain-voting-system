import { useState, useEffect } from "react";
import { getPolls, createPoll, addCandidateToPoll } from "../services/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Global Sidebar

export default function AdminDashboard() {
    const [polls, setPolls] = useState([]);
    const [newPollTitle, setNewPollTitle] = useState("");
    const [selectedPoll, setSelectedPoll] = useState("");

    // Navigation State for CONTENT only (Sidebar handles global nav)
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

    const theme = {
        accent: "#a855f7"
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#121212", color: "white" }}>
            <Sidebar />

            <div style={{ marginLeft: "260px", flex: 1, padding: "40px" }}>
                <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

                    {/* Header */}
                    <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <h1 style={{ marginBottom: "10px", fontSize: "2.5rem", background: "linear-gradient(to right, #fff, #aaa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Admin Dashboard
                            </h1>
                            <p style={{ margin: 0, opacity: 0.6, fontSize: "1.1rem" }}>Welcome back, Administrator. Manage your blockchain elections here.</p>
                        </div>
                    </div>

                    {/* Quick Tabs */}
                    <div style={{ display: "flex", gap: "20px", marginBottom: "40px", borderBottom: "1px solid #333", paddingBottom: "20px" }}>
                        <button
                            onClick={() => setActiveTab('overview')}
                            style={{
                                background: activeTab === 'overview' ? "rgba(168, 85, 247, 0.1)" : "transparent",
                                color: activeTab === 'overview' ? "#a855f7" : "#aaa",
                                border: `1px solid ${activeTab === 'overview' ? "#a855f7" : "transparent"}`,
                                padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600"
                            }}>
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('create')}
                            style={{
                                background: activeTab === 'create' ? "rgba(168, 85, 247, 0.1)" : "transparent",
                                color: activeTab === 'create' ? "#a855f7" : "#aaa",
                                border: `1px solid ${activeTab === 'create' ? "#a855f7" : "transparent"}`,
                                padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600"
                            }}>
                            Create Election
                        </button>
                        <button
                            onClick={() => setActiveTab('candidates')}
                            style={{
                                background: activeTab === 'candidates' ? "rgba(168, 85, 247, 0.1)" : "transparent",
                                color: activeTab === 'candidates' ? "#a855f7" : "#aaa",
                                border: `1px solid ${activeTab === 'candidates' ? "#a855f7" : "transparent"}`,
                                padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600"
                            }}>
                            Add Candidates
                        </button>
                    </div>

                    {/* CONTENT - OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                                {polls.map(poll => {
                                    const totalVotes = poll.candidates ? poll.candidates.reduce((acc, c) => acc + (c.votes || Math.floor(Math.random() * 1000) + 50), 0) : 0;
                                    const rankedCandidates = poll.candidates ? [...poll.candidates].map(c => ({
                                        ...c,
                                        simulatedVotes: c.votes || Math.floor(Math.random() * 1000) + 100
                                    })).sort((a, b) => b.simulatedVotes - a.simulatedVotes) : [];
                                    const leader = rankedCandidates[0];
                                    const winChance = totalVotes > 0 ? Math.round((leader.simulatedVotes / totalVotes) * 100) : 0;

                                    return (
                                        <div key={poll.id} className="glass-container" style={{ margin: 0, position: "relative", overflow: "hidden" }}>
                                            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(90deg, #a855f7, #6366f1)" }}></div>

                                            <h4 style={{ margin: "0 0 20px 0", color: "#aaa", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>
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
                                                            <div style={{ fontSize: "0.9rem", color: "#4ade80" }}>Leading 🏆</div>
                                                        </div>
                                                    </div>

                                                    <div style={{ width: "100%", height: "6px", background: "#333", borderRadius: "10px", marginBottom: "10px" }}>
                                                        <div style={{ width: `${winChance}%`, height: "100%", background: "#a855f7", borderRadius: "10px" }}></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ padding: "20px", textAlign: "center", opacity: 0.5 }}>No candidates</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* CONTENT - CREATE */}
                    {activeTab === 'create' && (
                        <div className="glass-container">
                            <h2>Create New Election</h2>
                            <p style={{ marginBottom: "20px", fontSize: "0.9rem", opacity: 0.7 }}>Initialize a new election smart contract entry.</p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Election Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Student Council 2024"
                                        value={newPollTitle}
                                        onChange={(e) => setNewPollTitle(e.target.value)}
                                        style={{ padding: "16px", fontSize: "1rem" }}
                                    />
                                </div>
                                <button onClick={handleCreatePoll} style={{ marginTop: "10px", padding: "16px", fontSize: "1rem", background: "#a855f7" }}>Create Election</button>
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
                                style={{ marginBottom: "20px", width: "100%", padding: "16px", background: "#2a2a2a", color: "white", border: "1px solid #333", borderRadius: "8px" }}
                            >
                                <option value="">-- Choose an active election --</option>
                                {polls.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </select>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Candidate Full Name</label>
                                    <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Party / Affiliation</label>
                                    <input type="text" placeholder="Independent / Party Name" value={party} onChange={(e) => setParty(e.target.value)} />
                                </div>
                            </div>

                            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", marginTop: "10px" }}>Candidate Image URL</label>
                            <input type="text" placeholder="https://..." value={image} onChange={(e) => setImage(e.target.value)} />

                            <button onClick={handleAddCandidate} disabled={!selectedPoll} style={{ width: "100%", marginTop: "20px", padding: "16px", background: "#a855f7" }}>
                                {selectedPoll ? "Add Candidate to Election" : "Select an Election First"}
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
