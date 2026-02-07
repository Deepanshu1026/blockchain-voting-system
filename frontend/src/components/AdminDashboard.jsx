import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { getPolls, createPoll, getCandidates, addCandidate, addCandidateToPoll, deleteCandidate } from "../services/api";
import { FaUserFriends, FaPoll, FaClipboardList, FaPlus, FaLink, FaCalendarAlt, FaTrash, FaCheckCircle } from "react-icons/fa";

export default function AdminDashboard() {
    const [polls, setPolls] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [newPollTitle, setNewPollTitle] = useState("");
    const [newPollDesc, setNewPollDesc] = useState("");
    const [newPollEndDate, setNewPollEndDate] = useState("");
    const [newCandidateName, setNewCandidateName] = useState("");
    const [newCandidateParty, setNewCandidateParty] = useState("");
    const [newCandidateImage, setNewCandidateImage] = useState("");

    // Selection states for linking
    const [selectedPollId, setSelectedPollId] = useState("");
    const [selectedCandidateId, setSelectedCandidateId] = useState("");

    // Tabs for management
    const [activeSection, setActiveSection] = useState("overview"); // 'overview', 'polls', 'candidates'

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const [pollsData, candidatesData] = await Promise.all([
                getPolls(),
                getCandidates()
            ]);

            if (pollsData.polls) setPolls(pollsData.polls);
            else if (Array.isArray(pollsData)) setPolls(pollsData);

            if (candidatesData.candidates) setCandidates(candidatesData.candidates);
            else if (Array.isArray(candidatesData)) setCandidates(candidatesData);

        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteCandidate = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete candidate "${name}"? This cannot be undone.`)) {
            try {
                const res = await deleteCandidate(id);
                if (res.success) {
                    alert("Candidate deleted successfully");
                    fetchData();
                } else {
                    alert("Failed to delete candidate: " + res.error);
                }
            } catch (error) {
                console.error("Error deleting candidate", error);
                alert("An error occurred while deleting candidate");
            }
        }
    };

    const handleCreatePoll = async (e) => {
        e.preventDefault();
        try {
            await createPoll({ title: newPollTitle, description: newPollDesc, endDate: newPollEndDate });
            alert("Poll created successfully!");
            setNewPollTitle(""); setNewPollDesc(""); setNewPollEndDate("");
            fetchData();
        } catch (error) { alert("Failed to create poll"); }
    };

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        try {
            // Using a mock image service if none provided
            const imageUrl = newCandidateImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newCandidateName}`;
            await addCandidate({ name: newCandidateName, party: newCandidateParty || "Independent", imageUrl });
            alert("Candidate added!");
            setNewCandidateName(""); setNewCandidateParty(""); setNewCandidateImage("");
            fetchData();
        } catch (error) { alert("Failed to add candidate"); }
    };

    const handleAddCandidateToPoll = async (e) => {
        e.preventDefault();
        try {
            await addCandidateToPoll({ pollId: selectedPollId, candidateId: selectedCandidateId });
            alert("Candidate linked!");
            setSelectedPollId(""); setSelectedCandidateId("");
            fetchData();
        } catch (error) { alert("Failed to link candidate"); }
    };

    // Calculate specific stats
    const totalVotes = candidates.reduce((acc, c) => acc + (c.vote_count || 0), 0);
    const activePollsCount = polls.filter(p => new Date(p.endDate) > new Date()).length;

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#000", color: "#e7e9ea", fontFamily: "Inter, sans-serif" }}>
            <Sidebar role="admin" />

            <div style={{ flex: 1, marginLeft: "275px", padding: "40px", maxWidth: "1200px" }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                    <div>
                        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0, color: "white" }}>Admin Dashboard</h1>
                        <p style={{ color: "#71767b", marginTop: "5px" }}>Manage your blockchain voting system</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px", background: "#16181c", padding: "5px", borderRadius: "30px", border: "1px solid #2f3336" }}>
                        <TabButton active={activeSection === "overview"} onClick={() => setActiveSection("overview")} label="Overview" />
                        <TabButton active={activeSection === "polls"} onClick={() => setActiveSection("polls")} label="Polls" />
                        <TabButton active={activeSection === "candidates"} onClick={() => setActiveSection("candidates")} label="Candidates" />
                    </div>
                </header>

                {/* Overview Section */}
                {activeSection === "overview" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                        <StatCard title="Active Polls" value={activePollsCount} total={polls.length} icon={<FaPoll size={24} color="#1d9bf0" />} />
                        <StatCard title="Total Candidates" value={candidates.length} icon={<FaUserFriends size={24} color="#00ba7c" />} />
                        <StatCard title="Total Votes Cast" value={totalVotes} icon={<FaCheckCircle size={24} color="#f91880" />} />

                        <div style={{ gridColumn: "span 3", marginTop: "20px" }}>
                            <h3 style={{ borderBottom: "1px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>Quick Actions</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                                <QuickActionCard title="Create New Poll" onClick={() => setActiveSection("polls")} icon={<FaPlus />} desc="Launch a new election" color="#1d9bf0" />
                                <QuickActionCard title="Add Candidate" onClick={() => setActiveSection("candidates")} icon={<FaUserFriends />} desc="Register new profile" color="#00ba7c" />
                                <QuickActionCard title="Manage Voters" onClick={() => alert("Redirect to verification")} icon={<FaClipboardList />} desc="Verify IDs" color="#f91880" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Polls Management */}
                {activeSection === "polls" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                        {/* Create Poll Panel */}
                        <div className="glass-panel" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
                            <div>
                                <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><FaPlus /> Create New Poll</h3>
                                <form onSubmit={handleCreatePoll} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                    <input className="admin-input" style={{ gridColumn: "span 2" }} placeholder="Poll Title" value={newPollTitle} onChange={e => setNewPollTitle(e.target.value)} required />
                                    <textarea className="admin-input" style={{ gridColumn: "span 2" }} placeholder="Description" rows="2" value={newPollDesc} onChange={e => setNewPollDesc(e.target.value)} />
                                    <div style={{ gridColumn: "span 2" }}>
                                        <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", color: "#71767b" }}>End Date</label>
                                        <input className="admin-input" style={{ width: "100%" }} type="date" value={newPollEndDate} onChange={e => setNewPollEndDate(e.target.value)} required />
                                    </div>
                                    <button type="submit" className="admin-btn-primary" style={{ gridColumn: "span 2" }}>Launch Poll</button>
                                </form>
                            </div>

                            <div style={{ borderLeft: "1px solid #2f3336", paddingLeft: "30px" }}>
                                <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><FaLink /> Link Candidate</h3>
                                <form onSubmit={handleAddCandidateToPoll} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                    <select className="admin-input" value={selectedPollId} onChange={e => setSelectedPollId(e.target.value)} required>
                                        <option value="">Select Poll</option>
                                        {polls.map(p => <option key={p._id || p.id} value={p._id || p.id}>{p.title}</option>)}
                                    </select>
                                    <select className="admin-input" value={selectedCandidateId} onChange={e => setSelectedCandidateId(e.target.value)} required>
                                        <option value="">Select Candidate</option>
                                        {candidates.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
                                    </select>
                                    <button type="submit" className="admin-btn-secondary">Link Candidate</button>
                                </form>
                            </div>
                        </div>

                        {/* Existing Polls List */}
                        <div>
                            <h3 style={{ marginBottom: "20px" }}>Existing Polls</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
                                {polls.map(poll => {
                                    const isActive = new Date(poll.endDate) > new Date();
                                    return (
                                        <div key={poll.id} className="glass-panel" style={{ position: "relative" }}>
                                            <div style={{ position: "absolute", top: "20px", right: "20px" }}>
                                                {isActive
                                                    ? <span style={{ background: "rgba(0, 186, 124, 0.1)", color: "#00ba7c", padding: "4px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "bold" }}>Running</span>
                                                    : <span style={{ background: "rgba(249, 24, 128, 0.1)", color: "#f91880", padding: "4px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "bold" }}>Ended</span>
                                                }
                                            </div>
                                            <h4 style={{ fontSize: "1.1rem", marginBottom: "5px" }}>{poll.title}</h4>
                                            <p style={{ color: "#71767b", fontSize: "0.9rem", marginBottom: "15px", height: "40px", overflow: "hidden" }}>{poll.description}</p>

                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#71767b", borderTop: "1px solid #2f3336", paddingTop: "15px" }}>
                                                <span><FaCalendarAlt /> Ends: {new Date(poll.endDate).toLocaleDateString()}</span>
                                                <span><FaUserFriends /> {poll.candidates?.length || 0} Candidates</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Candidates Management */}
                {activeSection === "candidates" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px" }}>
                        <div className="glass-panel" style={{ height: "fit-content" }}>
                            <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><FaUserFriends /> Register Candidate</h3>
                            <form onSubmit={handleAddCandidate} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <input className="admin-input" placeholder="Name" value={newCandidateName} onChange={e => setNewCandidateName(e.target.value)} required />
                                <input className="admin-input" placeholder="Party / Affiliation" value={newCandidateParty} onChange={e => setNewCandidateParty(e.target.value)} />
                                <input className="admin-input" placeholder="Image URL (Optional)" value={newCandidateImage} onChange={e => setNewCandidateImage(e.target.value)} />
                                <button type="submit" className="admin-btn-primary">Add Candidate</button>
                            </form>
                        </div>

                        <div className="glass-panel">
                            <h3 style={{ marginBottom: "20px" }}>Candidate Directory</h3>
                            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                                {candidates.length === 0 ? <p style={{ color: "#71767b" }}>No candidates found.</p> : (
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr style={{ borderBottom: "1px solid #333", textAlign: "left" }}>
                                                <th style={{ padding: "12px", color: "#71767b" }}>Profile</th>
                                                <th style={{ padding: "12px", color: "#71767b" }}>Details</th>
                                                <th style={{ padding: "12px", color: "#71767b" }}>Stats</th>
                                                <th style={{ padding: "12px", color: "#71767b", textAlign: "right" }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {candidates.map(c => (
                                                <tr key={c._id || c.id} style={{ borderBottom: "1px solid #222" }}>
                                                    <td style={{ padding: "12px" }}>
                                                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#333", overflow: "hidden" }}>
                                                            {c.image_url ?
                                                                <img src={c.image_url} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                                : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontWeight: "bold" }}>{c.name[0]}</div>
                                                            }
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: "12px" }}>
                                                        <div style={{ fontWeight: "bold" }}>{c.name}</div>
                                                        <div style={{ fontSize: "0.8rem", color: "#71767b" }}>{c.party || "Independent"}</div>
                                                    </td>
                                                    <td style={{ padding: "12px" }}>
                                                        <div style={{ fontWeight: "bold", color: "#1d9bf0" }}>{c.vote_count || 0} Votes</div>
                                                    </td>
                                                    <td style={{ padding: "12px", textAlign: "right" }}>
                                                        <button
                                                            onClick={() => handleDeleteCandidate(c._id || c.id, c.name)}
                                                            style={{ background: "transparent", border: "none", color: "#f4212e", cursor: "pointer" }}
                                                            title="Delete Candidate"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* In-Line Styles for specific components */}
            <style>{`
                .glass-panel {
                    background: #16181c;
                    border: 1px solid #2f3336;
                    border-radius: 16px;
                    padding: 24px;
                }
                .admin-input {
                    background: #202327;
                    border: 1px solid #333;
                    color: white;
                    padding: 12px;
                    border-radius: 8px;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .admin-input:focus { border-color: #1d9bf0; }
                .admin-btn-primary {
                    background: #fff;
                    color: black;
                    padding: 12px 24px;
                    border-radius: 24px;
                    font-weight: bold;
                    border: none;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .admin-btn-primary:hover { opacity: 0.9; }
                .admin-btn-secondary {
                    background: transparent;
                    border: 1px solid #333;
                    color: #fff;
                    padding: 12px 24px;
                    border-radius: 24px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: border-color 0.2s;
                }
                .admin-btn-secondary:hover { border-color: #fff; }
                
                /* Scrollbar */
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #000; }
                ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #555; }
            `}</style>
        </div>
    );
}

function TabButton({ active, onClick, label }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: "8px 20px",
                background: active ? "#fff" : "transparent",
                color: active ? "#000" : "#71767b",
                border: "none",
                borderRadius: "24px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "0.9rem"
            }}
        >
            {label}
        </button>
    );
}

function StatCard({ title, value, total, icon, label }) {
    return (
        <div style={{ background: "#16181c", padding: "24px", borderRadius: "16px", border: "1px solid #2f3336", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
                <div style={{ color: "#71767b", marginBottom: "5px", fontSize: "0.9rem" }}>{title}</div>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>
                    {value}
                    {total && <span style={{ fontSize: "1rem", color: "#71767b", fontWeight: "normal" }}> / {total}</span>}
                </div>
                {label && <div style={{ fontSize: "0.75rem", color: "#333", marginTop: "5px" }}>{label}</div>}
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "12px" }}>
                {icon}
            </div>
        </div>
    );
}

function QuickActionCard({ title, icon, onClick, desc, color }) {
    return (
        <div onClick={onClick} style={{
            background: "#16181c",
            padding: "20px",
            borderRadius: "16px",
            border: "1px solid #2f3336",
            cursor: "pointer",
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "15px",
            transition: "background 0.2s"
        }}
            onMouseOver={e => e.currentTarget.style.background = "#202327"}
            onMouseOut={e => e.currentTarget.style.background = "#16181c"}
        >
            <div style={{ background: `${color}20`, color: color, padding: "12px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
            <div>
                <div style={{ fontWeight: "bold", color: "white", fontSize: "1rem" }}>{title}</div>
                <div style={{ fontSize: "0.85rem", color: "#71767b" }}>{desc}</div>
            </div>
        </div>
    );
}
