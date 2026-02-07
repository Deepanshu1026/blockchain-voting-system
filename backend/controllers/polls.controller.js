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

    // 1. Create on Blockchain (OPTIONAL FOR TESTING)
    try {
        if (process.env.VITE_CONTRACT_ADDRESS && process.env.VITE_CONTRACT_ADDRESS !== "0xYourContractAddressHere") {
            console.log(`Creating poll "${title}" on blockchain...`);
            const tx = await votingContract.createPoll(title);
            await tx.wait();
            console.log("Poll created on blockchain");
        } else {
            console.warn("Skipping Blockchain: Contract address not configured.");
        }
    } catch (err) {
        console.error("Blockchain Warning (continuing to DB):", err.message);
        // Don't return 500, just continue to DB for now
    }

    // 2. Create in DB
    const { data: poll, error } = await supabase
        .from("polls")
        .insert([{ title, description }])
        .select()
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, poll });
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

// Vote for Candidate
export async function voteForCandidate(req, res) {
    const { pollId, candidateId, voterId } = req.body;

    // 1. Check if user already voted
    const { data: existingVote, error: voteCheckError } = await supabase
        .from("votes")
        .select("*")
        .eq("poll_id", pollId)
        .eq("voter_id", voterId)
        .single();

    // If we find a vote, prevent voting again
    if (existingVote) {
        return res.status(400).json({ error: "You have already voted in this poll." });
    }

    // 2. Record Vote in 'votes' table
    const { error: recordVoteError } = await supabase
        .from("votes")
        .insert([{ poll_id: pollId, candidate_id: candidateId, voter_id: voterId }]);

    if (recordVoteError) {
        // If table doesn't exist, we might want to fail gracefully or just log it
        // For now, assume table exists. If not, this safeguards against double voting if it did.
        // We will proceed to increment count even if tracking fails (for demo purposes)
        // OR we return error to prompt user to create table.
        // Let's return error to be safe.
        return res.status(500).json({ error: "Failed to record vote. Backend likely missing 'votes' table." });
    }

    // 3. Increment Candidate Vote Count
    // We use a stored procedure or just manual fetch-update for simplicity in demo
    // RPC 'increment_vote' is better, but let's try manual read-update for now to avoid needing SQL setup for RPC

    const { data: candidate, error: fetchError } = await supabase
        .from("candidates")
        .select("vote_count")
        .eq("id", candidateId)
        .single();

    if (fetchError) return res.status(500).json({ error: "Candidate not found" });

    const newCount = (candidate.vote_count || 0) + 1;

    const { error: updateError } = await supabase
        .from("candidates")
        .update({ vote_count: newCount })
        .eq("id", candidateId);

    if (updateError) return res.status(500).json({ error: updateError.message });

    res.json({ success: true, message: "Vote cast successfully!" });
}
