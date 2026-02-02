import { supabase } from "../config/supabase.js";
import { generateHash } from "../services/hash.service.js";
import { verifyWalletSignature } from "../services/wallet.service.js";
import { votingContract } from "../config/blockchain.js";

// STEP 1: Verify ID
export async function verifyID(req, res) {
    const { idNumber } = req.body;

    // Check Supabase Table 'allowed_voters'
    // Expected Columns: id_number (text), is_registered (bool)
    const { data: user, error } = await supabase
        .from("allowed_voters")
        .select("*")
        .eq("id_number", idNumber)
        .single();

    if (error || !user) {
        return res.json({ success: false, message: "ID not found in government database." });
    }

    if (user.is_registered) {
        return res.json({ success: false, message: "ID already registered for voting." });
    }

    // Generate hash
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

    // 2️⃣ Verify DB status again
    if (generateHash(idNumber) !== uniqueHash) {
        return res.status(400).json({ error: "Hash mismatch" });
    }

    const { data: user, error: fetchError } = await supabase
        .from("allowed_voters")
        .select("*")
        .eq("id_number", idNumber)
        .single();

    if (fetchError || !user || user.is_registered) {
        return res.status(400).json({ error: "User invalid or already registered" });
    }

    // 3️⃣ AUTO REGISTER ON BLOCKCHAIN 🔥
    try {
        console.log(`Registering ${walletAddress} on blockchain...`);
        const tx = await votingContract.registerVoter(walletAddress);
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");
    } catch (err) {
        console.error("Blockchain Error:", err);
        return res.status(500).json({
            error: "Blockchain registration failed."
        });
    }

    // 4️⃣ Update Supabase
    const { error: updateError } = await supabase
        .from("allowed_voters")
        .update({
            is_registered: true,
            wallet_address: walletAddress
        })
        .eq("id_number", idNumber);

    if (updateError) {
        console.error("Supabase Update Error:", updateError);
        // Warning: Blockchain succeeded but DB update failed. In prod, need transaction/revert.
    }

    res.json({ success: true, message: "Registration Successful! You can now vote." });
}
