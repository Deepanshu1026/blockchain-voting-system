import { useState } from "react";
import { ethers } from "ethers";
import { bindWallet } from "../services/api";

export default function WalletConnect({ uniqueHash, idNumber, onSuccess }) {
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

            const res = await bindWallet({ uniqueHash, walletAddress: wallet, signature, idNumber });

            if (res.success) {
                alert(res.message);
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
        <div style={{ padding: "20px", border: "1px solid #ccc", marginTop: "20px" }}>
            <h3>Step 2: Connect Wallet</h3>
            <p>Identity Verified! Connect your wallet to register on blockchain.</p>
            <button onClick={connect} disabled={loading}>
                {loading ? "Registering..." : "Connect Wallet & Register"}
            </button>
        </div>
    );
}
