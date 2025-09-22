import express from "express";
import pool from "../db.js";
import auth from "../middleware/authMiddleware.js";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Create a note
router.post("/", auth, async (req, res) => {
    const { title, content } = req.body;
    const r = await pool.query(
        "INSERT INTO notes (user_id,title,content) VALUES($1,$2,$3) RETURNING *",
        [req.userId, title || null, content]
    );
    res.json(r.rows[0]);
});

// Get user notes
router.get("/", auth, async (req, res) => {
    const r = await pool.query(
        "SELECT * FROM notes WHERE user_id=$1 ORDER BY created_at DESC",
        [req.userId]
    );
    res.json(r.rows);
});

// Summarize
router.post("/:id/summarize", auth, async (req, res) => {
    const noteId = req.params.id;
    const r = await pool.query(
        "SELECT content FROM notes WHERE id=$1 AND user_id=$2",
        [noteId, req.userId]
    );
    const note = r.rows[0];
    if (!note) return res.status(404).json({ error: "Note not found" });

    const g = await openai.completions.create({
        model: "text-davinci-003",
        prompt: `Summarize the following text in 2-3 short sentences:\n\n${note.content}`,
        max_tokens: 150,
        temperature: 0.3,
    });

    const summaryText = g.choices[0].text.trim();
    await pool.query("UPDATE notes SET summary=$1, updated_at=now() WHERE id=$2", [
        summaryText,
        noteId,
    ]);
    res.json({ summary: summaryText });
});

// Translate
router.post("/:id/translate", auth, async (req, res) => {
    const { lang = "Spanish" } = req.body;
    const noteId = req.params.id;
    const r = await pool.query(
        "SELECT content FROM notes WHERE id=$1 AND user_id=$2",
        [noteId, req.userId]
    );
    const note = r.rows[0];
    if (!note) return res.status(404).json({ error: "Note not found" });

    const g = await openai.completions.create({
        model: "text-davinci-003",
        prompt: `Translate the following text to ${lang}. Keep the meaning and tone:\n\n${note.content}`,
        max_tokens: 500,
        temperature: 0.3,
    });

    const translation = g.choices[0].text.trim();

    // optional: if you want to store translations, add a JSON column to notes
    await pool.query(
        "UPDATE notes SET translation=$1, updated_at=now() WHERE id=$2",
        [translation, noteId]
    );

    res.json({ lang, translation });
});

export default router;
