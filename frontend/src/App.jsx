import { useState, useEffect } from "react";
import VerifyID from "./components/VerifyID";
import WalletConnect from "./components/WalletConnect";
import VotingDashboard from "./components/VotingDashboard";
import AdminDashboard from "./components/AdminDashboard";

function App() {
    const [step, setStep] = useState(1);
    const [uniqueHash, setUniqueHash] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (window.location.pathname === "/admin") {
            setIsAdmin(true);
        }
    }, []);

    const handleVerificationSuccess = (hash, id) => {
        setUniqueHash(hash);
        setIdNumber(id);
        setStep(2);
    };

    const handleRegistrationSuccess = () => {
        setStep(3);
    };

    if (isAdmin) {
        return <AdminDashboard />;
    }

    return (
        <div>
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
