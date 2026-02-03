import { useState, useEffect } from "react";
import { getPolls, createPoll, addCandidateToPoll } from "../services/api";

export default function AdminDashboard() {
    const [polls, setPolls] = useState([]);
    const [newPollTitle, setNewPollTitle] = useState("");
    const [selectedPoll, setSelectedPoll] = useState(null);

    // Candidate Form
    const [name, setName] = useState("");
    const [party, setParty] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        loadPolls();
    }, []);

    const loadPolls = async () => {
        const data = await getPolls();
        setPolls(data);
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
        <div style={{ padding: "20px" }}>
            <h1>🛡️ Admin Dashboard</h1>

            {/* Create Poll Section */}
            <div className="glass-container" style={{ marginBottom: "20px" }}>
                <h2>Create New Election</h2>
                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                        value={newPollTitle}
                        onChange={(e) => setNewPollTitle(e.target.value)}
                        placeholder="Election Title (e.g. 2026 President)"
                        style={{ flex: 1, padding: "10px" }}
                    />
                    <button onClick={handleCreatePoll}>Create</button>
                </div>
            </div>

            {/* Add Candidate Section */}
            <div className="glass-container">
                <h2>Add Candidate</h2>
                <select
                    value={selectedPoll || ""}
                    onChange={(e) => setSelectedPoll(e.target.value)}
                    style={{ width: "100%", marginBottom: "10px", padding: "10px", background: "#333", color: "white", border: "1px solid #555" }}
                >
                    <option value="">Select Election...</option>
                    {polls.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                </select>

                <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ display: "block", width: "100%", marginBottom: "10px", padding: "10px" }} />
                <input placeholder="Party" value={party} onChange={(e) => setParty(e.target.value)} style={{ display: "block", width: "100%", marginBottom: "10px", padding: "10px" }} />
                <input placeholder="Image URL (Optional)" value={image} onChange={(e) => setImage(e.target.value)} style={{ display: "block", width: "100%", marginBottom: "10px", padding: "10px" }} />

                <button onClick={handleAddCandidate} disabled={!selectedPoll} style={{ width: "100%" }}>Add Candidate</button>
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
    );
}
