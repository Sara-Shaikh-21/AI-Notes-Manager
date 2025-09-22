import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createNote, updateNote, getNote } from "../lib/api";
import * as api from "../lib/api"; // use named imports

export default function NoteEditor() {
    const { id } = useParams();
    const nav = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch note if editing
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const note = await api.getNote(id);
                setTitle(note.title || "");
                setContent(note.content || "");
            } catch (err) {
                console.error("Failed to fetch note:", err);
            }
        })();
    }, [id]);

    // Save new or updated note
    const save = async () => {
        setLoading(true);
        try {
            if (id) {
                await api.updateNote(id, { title, content });
            } else {
                await api.createNote({ title, content });
            }
            nav("/dashboard");
        } catch (err) {
            console.error("Failed to save note:", err);
            alert("Failed to save note. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-8">
            <div className="max-w-3xl bg-white p-6 rounded shadow">
                <h2 className="text-xl mb-4">{id ? "Edit Note" : "New Note"}</h2>

                <input
                    className="w-full border p-2 rounded mb-3"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    className="w-full border p-2 rounded h-48"
                    placeholder="Write your note..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <div className="flex gap-2 mt-3">
                    <button onClick={save} disabled={loading} className="btn btn-primary">
                        {loading ? "Saving..." : "Save"}
                    </button>
                    <button onClick={() => nav("/dashboard")} className="btn btn-outline">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
