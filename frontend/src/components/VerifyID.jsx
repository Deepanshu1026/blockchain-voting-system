import { useState } from "react";
import { verifyID } from "../services/api";

export default function VerifyID({ onSuccess }) {
    const [idNumber, setIdNumber] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await verifyID(idNumber);
            if (data.success) {
                onSuccess(data.uniqueHash, idNumber);
            } else {
                setError(data.message || "Verification failed");
            }
        } catch (err) {
            setError("Server error");
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ccc" }}>
            <h3>Step 1: Identity Verification</h3>
            <input
                placeholder="Enter Government ID (e.g. 123456789012)"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                style={{ padding: "8px", width: "80%" }}
            />
            <br /><br />
            <button onClick={handleVerify} disabled={loading}>
                {loading ? "Verifying..." : "Verify Identity"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
