import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { getPolls, createPoll, getCandidates, addCandidate, addCandidateToPoll } from "../services/api";

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

    // Tab state
    const [activeTab, setActiveTab] = useState("polls"); // 'polls' or 'candidates'

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

            // Adjust based on API response structure
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
        if (!newPollTitle || !newPollDesc || !newPollEndDate) return;

        try {
            await createPoll({
                title: newPollTitle,
                description: newPollDesc,
                endDate: newPollEndDate
            });
            alert("Poll created successfully!");
            // Reset form and refresh
            setNewPollTitle("");
            setNewPollDesc("");
            setNewPollEndDate("");
            fetchData();
        } catch (error) {
            console.error("Error creating poll", error);
            alert("Failed to create poll");
        }
    };

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        if (!newCandidateName) return;

        try {
            await addCandidate({ name: newCandidateName });
            alert("Candidate added successfully!");
            setNewCandidateName("");
            fetchData();
        } catch (error) {
            console.error("Error adding candidate", error);
            alert("Failed to add candidate");
        }
    };

    const handleAddCandidateToPoll = async (e) => {
        e.preventDefault();
        if (!selectedPollId || !selectedCandidateId) return;

        try {
            await addCandidateToPoll({
                pollId: selectedPollId,
                candidateId: selectedCandidateId
            });
            alert("Candidate added to poll!");
            setSelectedPollId("");
            setSelectedCandidateId("");
            fetchData();
        } catch (error) {
            console.error("Error adding candidate to poll", error);
            alert("Failed to add candidate to poll");
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#000", color: "#fff" }}>
            <Sidebar />
            <div style={{ flex: 1, marginLeft: "250px", padding: "40px" }}>
                <h1 style={{ fontSize: "2.5rem", marginBottom: "30px" }}>Admin Dashboard</h1>

                {/* Tabs */}
                {/* <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
                    <button 
                        onClick={() => setActiveTab("polls")}
                        style={{
                            padding: "10px 20px",
                            background: activeTab === "polls" ? "#fff" : "rgba(255,255,255,0.1)",
                            color: activeTab === "polls" ? "#000" : "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        Manage Polls
                    </button>
                    <button 
                        onClick={() => setActiveTab("candidates")}
                        style={{
                            padding: "10px 20px",
                            background: activeTab === "candidates" ? "#fff" : "rgba(255,255,255,0.1)",
                            color: activeTab === "candidates" ? "#000" : "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        Manage Candidates
                    </button>
                </div> */}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>

                    {/* Polls Section */}
                    <div>
                        <h2 style={{ marginBottom: "20px", borderBottom: "1px solid #333", paddingBottom: "10px" }}>Polls</h2>

                        <div className="glass-container" style={{ padding: "20px", marginBottom: "30px", background: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                            <h3>Create New Poll</h3>
                            <form onSubmit={handleCreatePoll} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
                                <input
                                    type="text"
                                    placeholder="Poll Title"
                                    value={newPollTitle}
                                    onChange={(e) => setNewPollTitle(e.target.value)}
                                    style={{ padding: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid #444", color: "white", borderRadius: "6px" }}
                                />
                                <textarea
                                    placeholder="Description"
                                    value={newPollDesc}
                                    onChange={(e) => setNewPollDesc(e.target.value)}
                                    style={{ padding: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid #444", color: "white", borderRadius: "6px", minHeight: "80px" }}
                                />
                                <input
                                    type="date"
                                    value={newPollEndDate}
                                    onChange={(e) => setNewPollEndDate(e.target.value)}
                                    style={{ padding: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid #444", color: "white", borderRadius: "6px" }}
                                />
                                <button type="submit" style={{ padding: "10px", background: "#fff", color: "black", fontWeight: "bold", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                                    Create Poll
                                </button>
                            </form>
                        </div>

                        <div className="glass-container" style={{ padding: "20px", background: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                            <h3>Assign Candidate to Poll</h3>
                            <form onSubmit={handleAddCandidateToPoll} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
                                <select
                                    value={selectedPollId}
                                    onChange={(e) => setSelectedPollId(e.target.value)}
                                    style={{ padding: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid #444", color: "white", borderRadius: "6px" }}
                                >
                                    <option value="">Select Poll</option>
                                    {polls.map(p => <option key={p.id || p._id} value={p.id || p._id}>{p.title}</option>)}
                                </select>
                                <select
                                    value={selectedCandidateId}
                                    onChange={(e) => setSelectedCandidateId(e.target.value)}
                                    style={{ padding: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid #444", color: "white", borderRadius: "6px" }}
                                >
                                    <option value="">Select Candidate</option>
                                    {candidates.map(c => <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>)}
                                </select>
                                <button type="submit" style={{ padding: "10px", background: "#fff", color: "black", fontWeight: "bold", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                                    Add Candidate to Poll
                                </button>
                            </form>
                        </div>

                        <div style={{ marginTop: "30px" }}>
                            <h3>Existing Polls</h3>
                            {polls.length === 0 ? <p style={{ color: "#aaa" }}>No polls created yet.</p> : (
                                <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
                                    {polls.map(poll => (
                                        <li key={poll.id || poll._id} style={{ padding: "10px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between" }}>
                                            <span>{poll.title}</span>
                                            <span style={{ color: "#aaa", fontSize: "0.8rem" }}>{poll.candidates?.length || 0} Candidates</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Candidates Section */}
                    <div>
                        <h2 style={{ marginBottom: "20px", borderBottom: "1px solid #333", paddingBottom: "10px" }}>Candidates</h2>

                        <div className="glass-container" style={{ padding: "20px", marginBottom: "30px", background: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                            <h3>Add New Candidate</h3>
                            <form onSubmit={handleAddCandidate} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
                                <input
                                    type="text"
                                    placeholder="Candidate Name"
                                    value={newCandidateName}
                                    onChange={(e) => setNewCandidateName(e.target.value)}
                                    style={{ padding: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid #444", color: "white", borderRadius: "6px" }}
                                />
                                <button type="submit" style={{ padding: "10px", background: "#fff", color: "black", fontWeight: "bold", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                                    Add Candidate
                                </button>
                            </form>
                        </div>

                        <div style={{ marginTop: "30px" }}>
                            <h3>Existing Candidates</h3>
                            {candidates.length === 0 ? <p style={{ color: "#aaa" }}>No candidates found.</p> : (
                                <ul style={{ listStyle: "none", padding: 0, marginTop: "10px", maxHeight: "400px", overflowY: "auto" }}>
                                    {candidates.map(candidate => (
                                        <li key={candidate.id || candidate._id} style={{ padding: "10px", borderBottom: "1px solid #333" }}>
                                            {candidate.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
