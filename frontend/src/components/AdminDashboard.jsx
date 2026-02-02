import { useState, useEffect } from "react";
import { addCandidate, getCandidates } from "../services/api";

export default function AdminDashboard() {
    const [candidates, setCandidates] = useState([]);
    const [form, setForm] = useState({ name: "", party: "", image_url: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        const data = await getCandidates();
        if (Array.isArray(data)) setCandidates(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await addCandidate(form);
        if (res.success) {
            alert("Candidate Added!");
            setForm({ name: "", party: "", image_url: "" });
            loadCandidates();
        } else {
            alert("Error: " + res.error);
        }
        setLoading(false);
    };

    return (
        <div className="glass-container" style={{ maxWidth: "800px" }}>
            <h2>🗳️ Admin Dashboard</h2>

            <form onSubmit={handleSubmit} style={{ textAlign: "left", marginBottom: "40px" }}>
                <h3>Add Candidate</h3>
                <div style={{ marginBottom: "15px" }}>
                    <label>Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label>Party</label>
                    <input
                        type="text"
                        value={form.party}
                        onChange={e => setForm({ ...form, party: e.target.value })}
                        required
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label>Image URL (Optional)</label>
                    <input
                        type="text"
                        value={form.image_url}
                        onChange={e => setForm({ ...form, image_url: e.target.value })}
                        placeholder="https://..."
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Candidate"}
                </button>
            </form>

            <h3>Current Candidates</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
                {candidates.map(c => (
                    <div key={c.id} style={{ background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                        {c.image_url && <img src={c.image_url} alt={c.name} style={{ width: "60px", height: "60px", borderRadius: "50%", marginBottom: "10px" }} />}
                        <h4>{c.name}</h4>
                        <p style={{ opacity: 0.7 }}>{c.party}</p>
                        <small>ID: {c.id}</small>
                    </div>
                ))}
            </div>
        </div>
    );
}
