import { useState, useEffect } from "react";
import { getPolls, createPoll, addCandidateToPoll } from "../services/api";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const [polls, setPolls] = useState([]);
    const [newPollTitle, setNewPollTitle] = useState("");
    const [selectedPoll, setSelectedPoll] = useState("");

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
        loadPolls(); // Reload to see updated counts
    };

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content" style={{ background: "transparent" }}>
                <h1>🛡️ Admin Dashboard</h1>

                {/* Create Poll */}
                <div className="glass-container" style={{ marginBottom: "30px" }}>
                    <h2>Create New Election</h2>
                    <input
                        type="text"
                        placeholder="Election Title (e.g., President 2026)"
                        value={newPollTitle}
                        onChange={(e) => setNewPollTitle(e.target.value)}
                        style={{ marginBottom: "10px" }}
                    />
                    <button onClick={handleCreatePoll} style={{ width: "100%" }}>Create Election</button>
                </div>

                {/* Add Candidate */}
                <div className="glass-container">
                    <h2>Add Candidate to Election</h2>
                    <select
                        value={selectedPoll}
                        onChange={(e) => setSelectedPoll(e.target.value)}
                        style={{ marginBottom: "10px", width: "100%", padding: "12px", background: "rgba(0,0,0,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                    >
                        <option value="">Select Election...</option>
                        {polls.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>

                    <input type="text" placeholder="Candidate Name" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: "10px" }} />
                    <input type="text" placeholder="Party / Affiliation" value={party} onChange={(e) => setParty(e.target.value)} style={{ marginBottom: "10px" }} />
                    <input type="text" placeholder="Image URL (Optional)" value={image} onChange={(e) => setImage(e.target.value)} style={{ marginBottom: "20px" }} />

                    <button onClick={handleAddCandidate} style={{ width: "100%" }}>Add Candidate</button>
                </div>

                <div style={{ marginTop: "20px" }}>
                    <h3>Existing Elections</h3>
                    {polls.map(p => (
                        <div key={p.id} style={{ border: "1px solid #444", padding: "15px", marginBottom: "15px", borderRadius: "8px", background: "rgba(255,255,255,0.05)" }}>
                            <strong style={{ fontSize: "1.2rem" }}>{p.title}</strong>
                            <p style={{ margin: "5px 0", opacity: 0.7 }}>Candidates: {p.candidates ? p.candidates.length : 0}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
