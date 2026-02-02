import { generateHash } from "../services/hash.service.js";
import { verifyWalletSignature } from "../services/wallet.service.js";
import { votingContract } from "../config/blockchain.js";
import { validIds, voters } from "../database/memory.db.js";

// STEP 1: Verify ID
export async function verifyID(req, res) {
    const { idNumber } = req.body;

    // 1. Generate local hash
    // In a real system, we might look up by raw ID or hash. 
    // Since our dummy DB has raw IDs, we look up by raw ID.
    const userFound = validIds.find(u => u.idNumber === idNumber);

    if (!userFound) {
        return res.json({ success: false, message: "ID not found in government database." });
    }

    if (userFound.isUsed) {
        return res.json({ success: false, message: "ID already registered for voting." });
    }

    // Generate hash to handle the session/flow
    const uniqueHash = generateHash(idNumber);

    res.json({
        success: true,
        uniqueHash,
        message: "Identity Verified! Please connect wallet."
    });
}

// STEP 2: Bind Wallet + Auto Register On-Chain
export async function bindWallet(req, res) {
    const { uniqueHash, walletAddress, signature, idNumber } = req.body;
    const message = `Bind wallet for voter ${uniqueHash}`;

    // 1️⃣ Verify ownership
    if (!verifyWalletSignature(message, signature, walletAddress)) {
        return res.status(401).json({ error: "Invalid signature" });
    }

    // 2️⃣ Verify Logic (Double check specific User)
    // We need the original ID or we trust the uniqueHash if we stored it temporarily.
    // For statelessness, let's assume the frontend passes the ID again or we trust that the uniqueHash 
    // is sufficient proof if we had a session. 
    // To keep it simple and secure-ish: verify the hash matches the idNumber provided.

    if (generateHash(idNumber) !== uniqueHash) {
        return res.status(400).json({ error: "Hash mismatch" });
    }

    const userFound = validIds.find(u => u.idNumber === idNumber);
    if (!userFound || userFound.isUsed) {
        return res.status(400).json({ error: "User invalid or already registered" });
    }

    // 3️⃣ AUTO REGISTER ON BLOCKCHAIN 🔥
    try {
        console.log(`Registering ${walletAddress} on blockchain...`);
        // Assuming adminWallet is set up correctly in blockchain.js
        const tx = await votingContract.registerVoter(walletAddress);
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");
    } catch (err) {
        console.error("Blockchain Error:", err);
        return res.status(500).json({
            error: "Blockchain registration failed. Ensure Admin has gas."
        });
    }

    // 4️⃣ Update Local DB
    userFound.isUsed = true;
    voters.push({
        uniqueHash,
        walletAddress,
        hasVoted: false
    });

    res.json({ success: true, message: "Registration Successful! You can now vote." });
}
