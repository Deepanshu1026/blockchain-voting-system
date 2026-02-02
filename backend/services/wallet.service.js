import { ethers } from "ethers";

export function verifyWalletSignature(message, signature, wallet) {
    const recovered = ethers.verifyMessage(message, signature);
    return recovered.toLowerCase() === wallet.toLowerCase();
}
