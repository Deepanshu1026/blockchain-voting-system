import { useState } from "react";
import VerifyID from "./components/VerifyID";
import WalletConnect from "./components/WalletConnect";
import VotingDashboard from "./components/VotingDashboard";

function App() {
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
        <div style={{ fontFamily: "Arial, sans-serif", width: "600px", margin: "50px auto", textAlign: "center" }}>
            <h2>Blockchain Voting System</h2>

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
                <VotingDashboard />
            )}
        </div>
    );
}

export default App;
