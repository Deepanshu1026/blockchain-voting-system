import { useState } from "react";
import VerifyID from "./components/VerifyID";
import WalletConnect from "./components/WalletConnect";

function App() {
    const [hash, setHash] = useState(null);

    return (
        <div>
            <h2>Blockchain Voting</h2>
            <VerifyID setHash={setHash} />
            {hash && <WalletConnect uniqueHash={hash} />}
        </div>
    );
}

export default App;
