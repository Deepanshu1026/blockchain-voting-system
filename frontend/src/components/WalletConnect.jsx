import { useState } from "react";
import { ethers } from "ethers";
import { bindWallet } from "../services/api";

export default function WalletConnect({ uniqueHash, idNumber, password, onSuccess }) {
    const [loading, setLoading] = useState(false);

    const connect = async () => {
        setLoading(true);
        try {
            if (!window.ethereum) return alert("Please install MetaMask!");

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const wallet = await signer.getAddress();

            const message = `Bind wallet for voter ${uniqueHash}`;
            const signature = await signer.signMessage(message);

            const res = await bindWallet({ uniqueHash, walletAddress: wallet, signature, idNumber, password });

            if (res.success) {
                // alert(res.message);
                onSuccess();
            } else {
                alert("Error: " + (res.error || "Registration failed"));
            }
        } catch (err) {
            console.error(err);
            alert("Connection failed: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="glass-container">
            <h2>🔗 Connect Wallet</h2>
            <p style={{ marginBottom: "30px" }}>
                Identity Verified! <br />
                <span style={{ color: "#4ade80" }}>{idNumber}</span>
            </p>

            <p style={{ opacity: 0.8, marginBottom: "20px" }}>
                Connect your database-registered wallet to finalize registration on the blockchain.
            </p>

            <button onClick={connect} disabled={loading} style={{ width: "100%" }}>
                {loading ? <span className="spinner"></span> : "Connect MetaMask & Register"}
            </button>
        </div>
    );
}
