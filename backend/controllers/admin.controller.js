import { supabase } from "../config/supabase.js";

// GET /api/admin/candidates
export async function getCandidates(req, res) {
    const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
}

// POST /api/admin/add-candidate
export async function addCandidate(req, res) {
    const { name, party, image_url } = req.body;

    if (!name || !party) {
        return res.status(400).json({ error: "Name and Party are required" });
    }

    const { data, error } = await supabase
        .from("candidates")
        .insert([{ name, party, image_url }])
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ success: true, candidate: data[0] });
}
