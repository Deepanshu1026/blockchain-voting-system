import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { getPolls } from "../services/api";

export default function VotingDashboard() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPolls() {
            try {
                const data = await getPolls();
                // If the data structure from backend is { success: true, polls: [] } or just []
                if (data.polls) {
                    setPolls(data.polls);
                } else if (Array.isArray(data)) {
                    setPolls(data);
                }
            } catch (error) {
                console.error("Failed to fetch polls", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPolls();
    }, []);

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#000", color: "#fff" }}>
            <Sidebar />
            <div style={{ flex: 1, marginLeft: "250px", padding: "40px" }}>
                <h1 style={{ fontSize: "2.5rem", marginBottom: "30px" }}>Active Elections</h1>

                {loading ? (
                    <p>Loading elections...</p>
                ) : polls.length === 0 ? (
                    <div className="glass-container" style={{ padding: "30px", textAlign: "center", color: "#aaa" }}>
                        <p>No active elections found.</p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                        {polls.map((poll) => (
                            <div key={poll.id || poll._id} style={{
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "16px",
                                padding: "20px"
                            }}>
                                <h2 style={{ marginBottom: "10px" }}>{poll.title}</h2>
                                <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "20px" }}>
                                    {poll.description}
                                </p>
                                <div style={{ marginBottom: "20px" }}>
                                    <h4 style={{ marginBottom: "10px", color: "#ddd" }}>Candidates:</h4>
                                    {poll.candidates && poll.candidates.map((candidate, idx) => (
                                        <div key={idx} style={{
                                            padding: "10px",
                                            background: "rgba(0,0,0,0.3)",
                                            marginBottom: "5px",
                                            borderRadius: "8px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}>
                                            <span>{candidate.name}</span>
                                            <button style={{
                                                padding: "5px 15px",
                                                background: "#fff",
                                                color: "#000",
                                                border: "none",
                                                borderRadius: "20px",
                                                fontWeight: "bold",
                                                cursor: "pointer"
                                            }}>
                                                Vote
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ fontSize: "0.8rem", color: "#666", textAlign: "right" }}>
                                    Ends: {new Date(poll.endDate).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
