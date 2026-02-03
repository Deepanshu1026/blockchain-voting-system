import { useState } from "react";
import VerifyID from "./VerifyID";
import WalletConnect from "./WalletConnect";
import VoterProfile from "./VoterProfile";
import { Link } from "react-router-dom";

export default function VerificationFlow() {
    const [step, setStep] = useState(1);
    const [uniqueHash, setUniqueHash] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [userData, setUserData] = useState(null);

    const [password, setPassword] = useState("");

    const handleVerificationSuccess = (hash, id, isRegistered, user) => {
        setUniqueHash(hash);
        setIdNumber(id);
        if (isRegistered && user) {
            setUserData(user);
            setStep(4); // Go straight to Profile (Step 4 now)
        } else {
            setStep(2); // Go to Password Creation
        }
    };

    const handlePasswordSet = (pwd) => {
        setPassword(pwd);
        setStep(3); // Go to Wallet Connect
    };

    const handleRegistrationSuccess = () => {
        setUserData({
            id_number: idNumber,
        });
        setStep(4);
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
                <div className="glass-container" style={{ maxWidth: "400px", margin: "40px auto" }}>
                    <h2>🔐 Create Password</h2>
                    <p style={{ marginBottom: "20px", opacity: 0.8 }}>Set a password to secure your voting account.</p>
                    <input
                        type="password"
                        placeholder="Enter a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", marginBottom: "20px" }}
                    />
                    <button
                        onClick={() => handlePasswordSet(password)}
                        disabled={password.length < 6}
                        style={{ width: "100%" }}
                    >
                        Next: Connect Wallet
                    </button>
                    {password.length > 0 && password.length < 6 && (
                        <p className="error-message" style={{ marginTop: "10px" }}>Password must be at least 6 chars</p>
                    )}
                </div>
            )}

            {step === 3 && (
                <WalletConnect
                    uniqueHash={uniqueHash}
                    idNumber={idNumber}
                    password={password}
                    onSuccess={handleRegistrationSuccess}
                />
            )}

            {step === 4 && (
                <VoterProfile user={userData} />
            )}
        </div>
    );
}
