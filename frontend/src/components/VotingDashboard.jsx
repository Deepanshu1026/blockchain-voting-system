import { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
// Simplified ABI for the Voting contract
const ABI = [
    "function vote(uint candidateId) external",
    "function votes(uint candidateId) public view returns (uint)"
];

export default function VotingDashboard() {
    const [candidateId, setCandidateId] = useState("");
    const [loading, setLoading] = useState(false);

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
        <div style={{ padding: "20px", border: "1px solid #ccc", marginTop: "20px" }}>
            <h3>Voting Dashboard</h3>
            <p>Select a candidate to vote for:</p>
            <div style={{ display: "flex", gap: "10px" }}>
                <button disabled={loading} onClick={() => vote(1)}>Vote Candidate 1</button>
                <button disabled={loading} onClick={() => vote(2)}>Vote Candidate 2</button>
                <button disabled={loading} onClick={() => vote(3)}>Vote Candidate 3</button>
            </div>
        </div>
    );
}
