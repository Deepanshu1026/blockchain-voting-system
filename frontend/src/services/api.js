const API = "http://localhost:5000/api/voter";

export const verifyID = (idNumber) =>
    fetch(`${API}/verify-id`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idNumber })
    }).then(res => res.json());

export const bindWallet = (data) =>
    fetch(`${API}/bind-wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
