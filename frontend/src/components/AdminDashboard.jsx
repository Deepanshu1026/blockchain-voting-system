import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { getPolls, createPoll, getCandidates, addCandidate, addCandidateToPoll } from "../services/api";
import { FaUserFriends, FaPoll, FaClipboardList, FaPlus, FaLink, FaCalendarAlt } from "react-icons/fa";

export default function AdminDashboard() {
    const [polls, setPolls] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [newPollTitle, setNewPollTitle] = useState("");
    const [newPollDesc, setNewPollDesc] = useState("");
    const [newPollEndDate, setNewPollEndDate] = useState("");
    const [newCandidateName, setNewCandidateName] = useState("");
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
            await addCandidate({ name: newCandidateName });
            alert("Candidate added!");
            setNewCandidateName("");
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

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#000", color: "#e7e9ea", fontFamily: "Inter, sans-serif" }}>
            <Sidebar role="admin" />

            <div style={{ flex: 1, marginLeft: "275px", padding: "40px", maxWidth: "1200px" }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                    <div>
                        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0, color: "white" }}>Admin Dashboard</h1>
                        <p style={{ color: "#71767b", marginTop: "5px" }}>Manage your blockchain voting system</p>
                    </div>
                    <div style={{ display: "flex", gap: "15px" }}>
                        <button onClick={() => setActiveSection("overview")} style={btnStyle(activeSection === "overview")}>Overview</button>
                        <button onClick={() => setActiveSection("polls")} style={btnStyle(activeSection === "polls")}>Polls</button>
                        <button onClick={() => setActiveSection("candidates")} style={btnStyle(activeSection === "candidates")}>Candidates</button>
                    </div>
                </header>

                {/* Overview Section */}
                {activeSection === "overview" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                        <StatCard title="Total Polls" value={polls.length} icon={<FaPoll size={24} color="#1d9bf0" />} />
                        <StatCard title="Total Candidates" value={candidates.length} icon={<FaUserFriends size={24} color="#00ba7c" />} />
                        <StatCard title="Active Voters" value="1,204" icon={<FaClipboardList size={24} color="#f91880" />} label="Mock Data" />

                        <div style={{ gridColumn: "span 3", marginTop: "20px" }}>
                            <h3 style={{ borderBottom: "1px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>Quick Actions</h3>
                            <div style={{ display: "flex", gap: "20px" }}>
                                <QuickActionCard title="Create New Poll" onClick={() => setActiveSection("polls")} icon={<FaPlus />} />
                                <QuickActionCard title="Add Candidate" onClick={() => setActiveSection("candidates")} icon={<FaUserFriends />} />
                                <QuickActionCard title="Verify Voters" onClick={() => alert("Redirect to verification")} icon={<FaClipboardList />} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Polls Management */}
                {activeSection === "polls" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
                        <div className="glass-panel">
                            <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><FaPlus /> Create Poll</h3>
                            <form onSubmit={handleCreatePoll} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <input className="admin-input" placeholder="Poll Title" value={newPollTitle} onChange={e => setNewPollTitle(e.target.value)} />
                                <textarea className="admin-input" placeholder="Description" rows="4" value={newPollDesc} onChange={e => setNewPollDesc(e.target.value)} />
                                <input className="admin-input" type="date" value={newPollEndDate} onChange={e => setNewPollEndDate(e.target.value)} />
                                <button type="submit" className="admin-btn-primary">Launch Poll</button>
                            </form>
                        </div>

                        <div className="glass-panel">
                            <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><FaLink /> Link Candidate</h3>
                            <form onSubmit={handleAddCandidateToPoll} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <select className="admin-input" value={selectedPollId} onChange={e => setSelectedPollId(e.target.value)}>
                                    <option value="">Select Poll</option>
                                    {polls.map(p => <option key={p._id || p.id} value={p._id || p.id}>{p.title}</option>)}
                                </select>
                                <select className="admin-input" value={selectedCandidateId} onChange={e => setSelectedCandidateId(e.target.value)}>
                                    <option value="">Select Candidate</option>
                                    {candidates.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
                                </select>
                                <button type="submit" className="admin-btn-secondary">Link Candidate</button>
                            </form>

                            <div style={{ marginTop: "30px" }}>
                                <h4 style={{ color: "#71767b" }}>Active Polls List</h4>
                                <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
                                    {polls.map(poll => (
                                        <li key={poll._id || poll.id} style={{ padding: "10px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between" }}>
                                            <span>{poll.title}</span>
                                            <span style={{ color: "#71767b", fontSize: "0.8rem" }}>Ends: {new Date(poll.endDate).toLocaleDateString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Candidates Management */}
                {activeSection === "candidates" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
                        <div className="glass-panel">
                            <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><FaUserFriends /> Add Candidate</h3>
                            <form onSubmit={handleAddCandidate} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <input className="admin-input" placeholder="Candidate Name / Party" value={newCandidateName} onChange={e => setNewCandidateName(e.target.value)} />
                                <button type="submit" className="admin-btn-primary">Add Candidate</button>
                            </form>
                        </div>

                        <div className="glass-panel">
                            <h3 style={{ marginBottom: "20px" }}>Registered Candidates</h3>
                            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                                {candidates.length === 0 ? <p style={{ color: "#71767b" }}>No candidates found.</p> : (
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr style={{ borderBottom: "1px solid #333", textAlign: "left" }}>
                                                <th style={{ padding: "10px", color: "#71767b" }}>Name</th>
                                                <th style={{ padding: "10px", color: "#71767b" }}>ID</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {candidates.map(c => (
                                                <tr key={c._id || c.id} style={{ borderBottom: "1px solid #222" }}>
                                                    <td style={{ padding: "10px" }}>{c.name}</td>
                                                    <td style={{ padding: "10px", color: "#555", fontSize: "0.8rem" }}>{c._id || c.id}</td>
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
                }
                .admin-input:focus { border-color: #1d9bf0; }
                .admin-btn-primary {
                    background: #fff;
                    color: black;
                    padding: 12px;
                    border-radius: 20px;
                    font-weight: bold;
                    border: none;
                    cursor: pointer;
                }
                .admin-btn-secondary {
                    background: transparent;
                    border: 1px solid #333;
                    color: #fff;
                    padding: 12px;
                    border-radius: 20px;
                    font-weight: bold;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}

function StatCard({ title, value, icon, label }) {
    return (
        <div style={{ background: "#16181c", padding: "24px", borderRadius: "16px", border: "1px solid #2f3336", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
                <div style={{ color: "#71767b", marginBottom: "5px", fontSize: "0.9rem" }}>{title}</div>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>{value}</div>
                {label && <div style={{ fontSize: "0.75rem", color: "#333", marginTop: "5px" }}>{label}</div>}
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "12px" }}>
                {icon}
            </div>
        </div>
    );
}

function QuickActionCard({ title, icon, onClick }) {
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
            <div style={{ background: "#1d9bf0", color: "white", padding: "10px", borderRadius: "50%", display: "flex" }}>{icon}</div>
            <span style={{ fontWeight: "bold", color: "white" }}>{title}</span>
        </div>
    );
}

const btnStyle = (isActive) => ({
    padding: "8px 16px",
    background: isActive ? "#fff" : "transparent",
    color: isActive ? "#000" : "#71767b",
    border: "none",
    borderRadius: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s"
});
