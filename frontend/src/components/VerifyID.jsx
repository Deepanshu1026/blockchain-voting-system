import { useState } from "react";
import { verifyID } from "../services/api";
import IDUploader from "./IDUploader";

export default function VerifyID({ onSuccess }) {
    const [idNumber, setIdNumber] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (!idNumber) return setError("Please enter or scan an ID.");
        setLoading(true);
        setError("");
        try {
            const data = await verifyID(idNumber);
            if (data.success) {
                onSuccess(data.uniqueHash, idNumber, data.isRegistered, data.user);
            } else {
                setError(data.message || "Verification failed");
            }
        } catch (err) {
            setError("Server error");
        }
        setLoading(false);
    };

    const handleScan = (scannedId) => {
        if (scannedId) {
            setIdNumber(scannedId);
        }
    };

    return (
        <div className="glass-container">
            <h2>🔐 Identity Verification</h2>
            <p style={{ marginBottom: "20px", opacity: 0.8 }}>Upload your Government ID to verify your identity.</p>

            <IDUploader onScanComplete={handleScan} />

            <div style={{ margin: "20px 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}></div>

            <p>Or enter manually:</p>
            <input
                type="text"
                placeholder="Enter 12-digit Aadhaar ID"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                style={{ marginBottom: "20px" }}
            />

            <button onClick={handleVerify} disabled={loading} style={{ width: "100%" }}>
                {loading ? <span className="spinner"></span> : "Verify & Proceed"}
            </button>

            {error && <p className="error-message" style={{ marginTop: "15px" }}>{error}</p>}
        </div>
    );
}
