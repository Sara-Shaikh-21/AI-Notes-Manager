import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function NoteCard({ note, onSummarize, onTranslate }) {
    return (
        <div className="bg-white p-4 rounded shadow mb-3">
            <div className="flex justify-between items-start">
                <h3 className="font-semibold">{note.title || "Untitled"}</h3>
                <div className="text-sm text-slate-500">{new Date(note.created_at).toLocaleString()}</div>
            </div>
            <p className="mt-2 text-sm">{note.content.slice(0, 200)}{note.content.length > 200 && '...'}</p>

            {note.summary && (
                <div className="mt-3 p-3 bg-slate-50 rounded">
                    <strong>Summary:</strong>
                    <p>{note.summary}</p>
                </div>
            )}

            {note.translation && Array.isArray(note.translation) && note.translation.length > 0 && (
                <div className="mt-3 p-3 bg-slate-50 rounded">
                    <strong>Translations:</strong>
                    {note.translation.map((t, i) => <div key={i} className="text-sm">{t.lang}: {t.text}</div>)}
                </div>
            )}

            <div className="mt-3 flex gap-2">
                <button onClick={() => onSummarize(note.id)} className="btn btn-outline">Summarize</button>
                <button onClick={() => onTranslate(note.id, "Spanish")} className="btn btn-outline">Translate (Spanish)</button>
                <Link to={`/notes/${note.id}`} className="btn btn-outline">Open</Link>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { logout, user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const res = await api.get("/notes");
            setNotes(res.data);
        } catch (e) {
            console.error(e);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchNotes(); }, []);

    const onSummarize = async (id) => {
        try {
            await api.post(`/notes/${id}/summarize`);
            await fetchNotes();
        } catch (e) { console.error(e); }
    };

    const onTranslate = async (id, lang) => {
        try {
            await api.post(`/notes/${id}/translate`, { lang });
            await fetchNotes();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600">{user?.email}</span>
                    <Link to="/notes/new" className="btn btn-primary">New Note</Link>
                    <button onClick={logout} className="btn btn-outline">Logout</button>
                </div>
            </div>

            {loading ? <div>Loading...</div> : notes.length === 0 ? <div>No notes yet</div> : (
                notes.map(n => <NoteCard key={n.id} note={n} onSummarize={onSummarize} onTranslate={onTranslate} />)
            )}
        </div>
    );
}
