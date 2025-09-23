// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../lib/api"; // Import API methods
import { useAuth } from "../auth/AuthContext";

function NoteCard({ note, onSummarize, onTranslate }) {
    return (
        <div className="bg-white p-4 rounded shadow mb-3">
            <div className="flex justify-between items-start">
                <h3 className="font-semibold">{note.title || "Untitled"}</h3>
                <div className="text-sm text-slate-500">
                    {new Date(note.created_at).toLocaleString()}
                </div>
            </div>

            <p className="mt-2 text-sm">
                {note.content?.slice(0, 200)}
                {note.content?.length > 200 && "..."}
            </p>

            {note.summary && (
                <div className="mt-3 p-3 bg-slate-50 rounded">
                    <strong>Summary:</strong>
                    <p>{note.summary}</p>
                </div>
            )}

            {Array.isArray(note.translation) && note.translation.length > 0 && (
                <div className="mt-3 p-3 bg-slate-50 rounded">
                    <strong>Translations:</strong>
                    {note.translation.map((t, i) => (
                        <div key={i} className="text-sm">
                            {t.lang}: {t.text}
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-3 flex gap-2">
                <button
                    onClick={() => onSummarize(note.id)}
                    className="btn btn-primary"
                >
                    Summarize
                </button>
                <button
                    onClick={() => onTranslate(note.id, "Spanish")}
                    className="btn btn-primary"
                >
                    Translate (Spanish)
                </button>
                <Link to={`/notes/${note.id}`} className="btn btn-primary">
                    Open
                </Link>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch notes from API
    const fetchNotes = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.fetchNotes();
            setNotes(Array.isArray(res) ? res : []);
        } catch (e) {
            console.error(e);
            setError("Failed to fetch notes. Please try again.");
            setNotes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // Summarize note
    const onSummarize = async (id) => {
        try {
            await api.summarizeNote(id);
            fetchNotes(); // refresh list
        } catch (e) {
            console.error(e);
            setError("Failed to summarize note.");
        }
    };

    // Translate note
    const onTranslate = async (id, lang) => {
        try {
            await api.translateNote(id, lang);
            fetchNotes(); // refresh list
        } catch (e) {
            console.error(e);
            setError(`Failed to translate note to ${lang}.`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600">{user?.email}</span>
                    <Link to="/notes/new" className="btn btn-primary">
                        New Note
                    </Link>
                    <button onClick={handleLogout} className="btn btn-primary">
                        Logout
                    </button>
                </div>
            </div>

            {loading && <div>Loading notes...</div>}

            {!loading && error && (
                <div className="text-red-500 mb-3">{error}</div>
            )}

            {!loading && !error && notes.length === 0 && (
                <div>No notes yet</div>
            )}

            {!loading && !error && notes.length > 0 && (
                <div>
                    {notes.map((n) => (
                        <NoteCard
                            key={n.id}
                            note={n}
                            onSummarize={onSummarize}
                            onTranslate={onTranslate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
