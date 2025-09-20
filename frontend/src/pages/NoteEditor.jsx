import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function NoteEditor() {
    const { id } = useParams();
    const nav = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await api.get(`/notes/${id}`);
                const note = res.data;
                setTitle(note.title || "");
                setContent(note.content || "");
            } catch (e) {
                console.error(e);
            }
        })();
    }, [id]);

    const save = async () => {
        setLoading(true);
        try {
            if (id) {
                await api.put(`/notes/${id}`, { title, content });
            } else {
                await api.post("/notes", { title, content });
            }
            nav("/dashboard");
        } catch (e) {
            console.error(e);
        } finally { setLoading(false); }
    };

    return (
        <div className="container py-8">
            <div className="max-w-3xl bg-white p-6 rounded shadow">
                <h2 className="text-xl mb-4">{id ? "Edit Note" : "New Note"}</h2>
                <input className="w-full border p-2 rounded mb-3" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea className="w-full border p-2 rounded h-48" placeholder="Write your note..." value={content} onChange={e => setContent(e.target.value)} />
                <div className="flex gap-2 mt-3">
                    <button onClick={save} disabled={loading} className="btn btn-primary">{loading ? "Saving..." : "Save"}</button>
                    <button onClick={() => nav("/dashboard")} className="btn btn-outline">Cancel</button>
                </div>
            </div>
        </div>
    );
}
