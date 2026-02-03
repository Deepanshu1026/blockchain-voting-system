import { useState } from "react";
import VerifyID from "./VerifyID";
import WalletConnect from "./WalletConnect";
import { Link } from "react-router-dom";

export default function VerificationFlow() {
    const [step, setStep] = useState(1);
    const [uniqueHash, setUniqueHash] = useState("");
    const [idNumber, setIdNumber] = useState("");

    const handleVerificationSuccess = (hash, id) => {
        setUniqueHash(hash);
        setIdNumber(id);
        setStep(2);
    };

    const handleRegistrationSuccess = () => {
        setStep(3);
    };

    return (
        <div>
            <div style={{ padding: "20px" }}>
                <Link to="/" style={{ color: "white", textDecoration: "none", opacity: 0.7 }}>
                    ← Back to Home
                </Link>
            </div>

            {step === 1 && (
                <VerifyID onSuccess={handleVerificationSuccess} />
            )}

            {step === 2 && (
                <WalletConnect
                    uniqueHash={uniqueHash}
                    idNumber={idNumber}
                    onSuccess={handleRegistrationSuccess}
                />
            )}

            {step === 3 && (
                <div className="glass-container" style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
                    <h2>Registration Complete!</h2>
                    <p style={{ marginBottom: "2rem" }}>
                        Your identity has been verified and your wallet is now registered.
                        You can now proceed to vote.
                    </p>
                    <Link to="/vote">
                        <button style={{ width: "100%", background: "var(--secondary-color, #646cff)" }}>
                            Go to Voting Portal
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
