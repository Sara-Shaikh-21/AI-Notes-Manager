const API = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export function authHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register(data) { return fetch(API + '/auth/register', { ...}) }
export async function login(data) { ... }
export async function fetchNotes() { ... }
export async function createNote(payload) { ... }
export async function summarize(noteId) { ... }
export async function translate(noteId, lang) { ... }
