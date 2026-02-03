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

    const handleVerificationSuccess = (hash, id, isRegistered, user) => {
        setUniqueHash(hash);
        setIdNumber(id);
        if (isRegistered && user) {
            setUserData(user);
            setStep(3); // Go straight to Profile
        } else {
            setStep(2); // Go to Wallet Connect
        }
    };

    const handleRegistrationSuccess = () => {
        // After registration, show profile with current data
        setUserData({
            id_number: idNumber,
            // Wallet address would be nice here, but for now just showing connected status
        });
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
                <VoterProfile user={userData} />
            )}
        </div>
    );
}
