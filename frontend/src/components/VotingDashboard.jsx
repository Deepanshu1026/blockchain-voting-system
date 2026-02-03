import { useState, useEffect } from "react";
import { getPolls } from "../services/api";
import { ethers } from "ethers";
import { votingContractAddress, votingContractABI } from "../config/contracts";

export default function VotingDashboard() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState({}); // loading state per poll
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            navigate("/login");
        }
        loadPolls();
    }, []);

    const loadPolls = async () => {
        const data = await getPolls();
        setPolls(data);
    };

    const castVote = async (pollId, candidateId) => {
        if (!window.ethereum) return alert("Please install MetaMask");

        try {
            setLoading(prev => ({ ...prev, [pollId]: true }));
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = new ethers.Contract(votingContractAddress, votingContractABI, signer);

            console.log(`Voting for candidate ${candidateId} in poll ${pollId}`);
            const tx = await contract.vote(pollId, candidateId);
            await tx.wait();

            alert("Vote Cast Successfully!");
            // In a real app, you'd update the UI to show "Voted" or refetch counts
        } catch (err) {
            console.error(err);
            alert("Voting Failed: " + (err.reason || err.message));
        }
        setLoading(prev => ({ ...prev, [pollId]: false }));
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>🗳️ Active Elections</h1>

            {polls.length === 0 && <p>No active elections found.</p>}

            {polls.map(poll => (
                <div key={poll.id} className="glass-container" style={{ marginBottom: "30px" }}>
                    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px", marginBottom: "20px" }}>
                        <h2 style={{ margin: 0 }}>{poll.title}</h2>
                        <p style={{ margin: "5px 0", opacity: 0.7 }}>{poll.description}</p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
                        {poll.candidates && poll.candidates.map(candidate => (
                            <div key={candidate.id} style={{
                                background: "rgba(255, 255, 255, 0.05)",
                                padding: "15px",
                                borderRadius: "10px",
                                textAlign: "center",
                                border: "1px solid rgba(255, 255, 255, 0.1)"
                            }}>
                                <img
                                    src={candidate.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
                                    alt={candidate.name}
                                    style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "10px", objectFit: "cover" }}
                                />
                                <h3 style={{ margin: "5px 0", fontSize: "1.1rem" }}>{candidate.name}</h3>
                                <p style={{ margin: "0 0 15px 0", opacity: 0.7, fontSize: "0.9rem" }}>{candidate.party}</p>

                                <button
                                    onClick={() => castVote(poll.id, candidate.id)}
                                    disabled={loading[poll.id]}
                                    style={{
                                        width: "100%",
                                        padding: "8px",
                                        background: loading[poll.id] ? "#555" : "var(--secondary-color, #646cff)"
                                    }}
                                >
                                    {loading[poll.id] ? "Voting..." : "Vote"}
                                </button>
                            </div>
                        ))}
                    </div>

                    {(!poll.candidates || poll.candidates.length === 0) && (
                        <p style={{ opacity: 0.5, fontStyle: "italic" }}>No candidates in this election yet.</p>
                    )}
                </div>
            ))}
        </div>
    );
}
