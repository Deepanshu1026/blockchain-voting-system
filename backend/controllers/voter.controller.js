import { supabase } from "../config/supabase.js";
import { generateHash } from "../services/hash.service.js";
import { verifyWalletSignature } from "../services/wallet.service.js";
import { votingContract } from "../config/blockchain.js";
import bcrypt from "bcrypt";

// STEP 1: Verify ID
export async function verifyID(req, res) {
    const { idNumber } = req.body;

    const { data: user, error } = await supabase
        .from("allowed_voters")
        .select("*")
        .eq("id_number", idNumber)
        .single();

    if (error || !user) {
        return res.json({ success: false, message: "ID not found in government database." });
    }

    if (user.is_registered) {
        // If registered, we expect them to login via /login endpoint, but for backward compat 
        // or just ID check, we can tell them to login.
        return res.json({
            success: true,
            isRegistered: true,
            user: {
                id_number: user.id_number,
                wallet_address: user.wallet_address,
                name: user.name
            },
            message: "User already registered. Please Login."
        });
    }

    const uniqueHash = generateHash(idNumber);

    res.json({
        success: true,
        uniqueHash,
        message: "Identity Verified! Create password and connect wallet."
    });
}

// STEP 2: Bind Wallet + Set Password + Auto Register
export async function bindWallet(req, res) {
    const { uniqueHash, walletAddress, signature, idNumber, password } = req.body;

    if (!password || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const message = `Bind wallet for voter ${uniqueHash}`;

    if (!verifyWalletSignature(message, signature, walletAddress)) {
        return res.status(401).json({ error: "Invalid signature" });
    }

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

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Register on Blockchain
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

    // Update Supabase with Password
    const { error: updateError } = await supabase
        .from("allowed_voters")
        .update({
            is_registered: true,
            wallet_address: walletAddress,
            password: hashedPassword
        })
        .eq("id_number", idNumber);

    if (updateError) {
        console.error("Supabase Update Error:", updateError);
    }

    res.json({ success: true, message: "Registration Successful! Login to vote." });
}

// STEP 3: Login
export async function login(req, res) {
    const { idNumber, password } = req.body;

    const { data: user, error } = await supabase
        .from("allowed_voters")
        .select("*")
        .eq("id_number", idNumber)
        .single();

    if (error || !user) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.is_registered) {
        return res.status(401).json({ success: false, message: "User not registered. Please verify ID first." });
    }

    // Check Password
    if (!user.password) {
        // Handle migration case where old users don't have password
        // maybe allow them to set one? For now, fail.
        return res.status(401).json({ success: false, message: "No password set. Please contact admin." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({
        success: true,
        user: {
            id_number: user.id_number,
            wallet_address: user.wallet_address,
            name: user.name
        },
        message: "Login successful"
    });
}
