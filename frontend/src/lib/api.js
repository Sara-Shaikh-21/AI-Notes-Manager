// src/lib/api.js
const API = "http://localhost:5001/api";

// Attach auth headers if token exists
export function authHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Auth endpoints
export async function register(data) {
    const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function login(data) {
    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

// Notes endpoints
export async function fetchNotes() {
    const res = await fetch(`${API}/notes`, { headers: { ...authHeaders() } });
    return res.json();
}

export async function getNote(id) {
    const res = await fetch(`${API}/notes/${id}`, { headers: { ...authHeaders() } });
    return res.json();
}

export async function createNote(payload) {
    const res = await fetch(`${API}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
    });
    return res.json();
}

export async function updateNote(id, payload) {
    const res = await fetch(`${API}/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
    });
    return res.json();
}

export async function summarizeNote(id) {
    const res = await fetch(`${API}/notes/${id}/summarize`, {
        method: "POST",
        headers: { ...authHeaders() },
    });
    return res.json();
}

export async function translateNote(id, lang) {
    const res = await fetch(`${API}/notes/${id}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ lang }),
    });
    return res.json();
}


// export async function summarizeNote(id) {
//     const res = await api.post(`/notes/${id}/summarize`);
//     return res.data;
// }

// export async function translateNote(id, lang) {
//     const res = await api.post(`/notes/${id}/translate`, { lang });
//     return res.data;
// }
