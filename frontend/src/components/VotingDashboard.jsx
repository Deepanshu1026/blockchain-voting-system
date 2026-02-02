import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getCandidates } from "../services/api";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const ABI = [
    "function vote(uint candidateId) external",
    "function votes(uint candidateId) public view returns (uint)"
];

export default function VotingDashboard() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getCandidates().then(data => {
            if (Array.isArray(data)) setCandidates(data);
        });
    }, []);

    const vote = async (id) => {
        setLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

            const tx = await contract.vote(id);
            alert("Vote submitted! Waiting for confirmation...");
            await tx.wait();
            alert("Vote Confirmed!");
        } catch (err) {
            console.error(err);
            alert("Voting failed: " + (err.reason || err.message));
        }
        setLoading(false);
    };

    return (
        <div className="glass-container" style={{ maxWidth: "800px" }}>
            <h2>🗳️ Vote for your Candidate</h2>
            <p>Select a candidate below to cast your secure blockchain vote.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "30px" }}>
                {candidates.map(candidate => (
                    <div key={candidate.id} style={{
                        background: "#fff",
                        padding: "20px",
                        borderRadius: "12px",
                        border: "1px solid var(--border-color)",
                        textAlign: "center"
                    }}>
                        <img
                            src={candidate.image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${candidate.name}`}
                            alt={candidate.name}
                            style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "15px" }}
                        />
                        <h3 style={{ margin: "0 0 5px 0" }}>{candidate.name}</h3>
                        <p style={{ color: "var(--primary)", fontWeight: "bold", margin: "0 0 15px 0" }}>{candidate.party}</p>

                        <button
                            onClick={() => vote(candidate.id)}
                            disabled={loading}
                            style={{ padding: "8px 16px", fontSize: "0.9rem" }}
                        >
                            {loading ? "Voting..." : "Vote"}
                        </button>
                    </div>
                ))}
            </div>

            {candidates.length === 0 && <p>Loading candidates...</p>}
        </div>
    );
}
