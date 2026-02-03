const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/voter";

export async function verifyID(idNumber) {
    const res = await fetch(`${API_URL}/verify-id`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idNumber }),
    });
    return res.json();
}

export async function bindWallet(data) {
    const res = await fetch(`${API_URL}/bind-wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function login(idNumber, password) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idNumber, password }),
    });
    return res.json();
}

export async function getCandidates() {
    const res = await fetch(`${API_URL.replace("/voter", "/admin")}/candidates`);
    return res.json();
}

export async function addCandidate(data) {
    const res = await fetch(`${API_URL.replace("/voter", "/admin")}/add-candidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}
