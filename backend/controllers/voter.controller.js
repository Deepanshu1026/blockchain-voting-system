import { supabase } from "../config/supabase.js";
import { generateHash } from "../services/hash.service.js";
import { verifyWalletSignature } from "../services/wallet.service.js";
import { votingContract } from "../config/blockchain.js";

// STEP 1: Verify ID
export async function verifyID(req, res) {
    const { idNumber } = req.body;
    const uniqueHash = generateHash(idNumber);

    const { data } = await supabase
        .from("voters")
        .select("id")
        .eq("unique_hash", uniqueHash)
        .single();

    res.json({ uniqueHash, registered: !!data });
}

// STEP 2: Bind Wallet + Auto Register On-Chain
export async function bindWallet(req, res) {
    const { uniqueHash, walletAddress, signature } = req.body;
    const message = `Bind wallet for voter ${uniqueHash}`;

    // 1️⃣ Verify ownership
    if (!verifyWalletSignature(message, signature, walletAddress)) {
        return res.status(401).json({ error: "Invalid signature" });
    }

    // 2️⃣ Save in Supabase
    const { error } = await supabase.from("voters").insert({
        unique_hash: uniqueHash,
        wallet_address: walletAddress
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    // 3️⃣ AUTO REGISTER ON BLOCKCHAIN 🔥
    try {
        const tx = await votingContract.registerVoter(walletAddress);
        await tx.wait();
    } catch (err) {
        return res.status(500).json({
            error: "Blockchain registration failed"
        });
    }

    res.json({ success: true });
}
