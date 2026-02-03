import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import VerifyID from "./VerifyID";
import WalletConnect from "./WalletConnect";
import { verifyID } from "../services/api";

export default function VerificationFlow() {
    const [step, setStep] = useState(1);
    const [idDetails, setIdDetails] = useState({ idNumber: "", uniqueHash: "" });
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // Step 1: Called when ID is verified
    const handleVerificationSuccess = async (hash, idNumber, isRegistered) => {
        setIdDetails({ idNumber, uniqueHash: hash });

        if (isRegistered) {
            alert("This ID is already registered. Please Login.");
            navigate("/login");
        } else {
            setStep(2); // Proceed to Password
        }
    };

    // Step 2: Called when Password is set
    const handlePasswordSet = (pwd) => {
        setPassword(pwd);
        setStep(3); // Proceed to Wallet Binding
    };

    // Step 3: Called when Wallet is bound successfully
    const handleRegistrationSuccess = () => {
        alert("Registration Successful! Please Login to continue.");
        navigate("/login");
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
                    uniqueHash={idDetails.uniqueHash}
                    idNumber={idDetails.idNumber}
                    password={password}
                    onSuccess={handleRegistrationSuccess}
                />
            )}
        </div>
    );
}
