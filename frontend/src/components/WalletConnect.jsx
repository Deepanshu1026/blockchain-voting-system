import { ethers } from "ethers";
import { bindWallet } from "../services/api";

export default function WalletConnect({ uniqueHash }) {
    const connect = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const wallet = await signer.getAddress();

        const message = `Bind wallet for voter ${uniqueHash}`;
        const signature = await signer.signMessage(message);

        await bindWallet({ uniqueHash, walletAddress: wallet, signature });
        alert("Wallet linked");
    };

    return <button onClick={connect}>Connect Wallet</button>;
}
