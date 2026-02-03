import { supabase } from "../config/supabase.js";
import { votingContract } from "../config/blockchain.js";

// Get All Active Polls
export async function getPolls(req, res) {
    const { data: polls, error } = await supabase
        .from("polls")
        .select(`
            *,
            candidates (*)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(polls);
}

// Create a New Poll (Admin Only)
export async function createPoll(req, res) {
    const { title, description } = req.body;

    // 1. Create on Blockchain
    try {
        console.log(`Creating poll "${title}" on blockchain...`);
        const tx = await votingContract.createPoll(title);
        await tx.wait();
        console.log("Poll created on blockchain");
    } catch (err) {
        console.error("Blockchain Error:", err);
        return res.status(500).json({ error: "Blockchain poll creation failed." });
    }

    // 2. Create in DB
    const { data, error } = await supabase
        .from("polls")
        .insert([{ title, description }])
        .select()
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, poll: data });
}

// Add Candidate to Poll
export async function addCandidateToPoll(req, res) {
    const { pollId, name, party, imageUrl } = req.body;

    const { data, error } = await supabase
        .from("candidates")
        .insert([{
            poll_id: pollId,
            name,
            party,
            image_url: imageUrl
        }])
        .select()
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, candidate: data });
}
