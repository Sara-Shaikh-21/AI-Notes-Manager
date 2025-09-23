// backend/routes/notes.js
import express from "express";
import pool from "../db.js";
import OpenAI from "openai";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Get all notes for logged in user
 */
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch notes" });
    }
});

/**
 * Create a new note
 */
router.post("/", authMiddleware, async (req, res) => {
    const { title, content } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
            [req.user.id, title, content]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create note" });
    }
});

/**
 * Summarize a note
 */
router.post("/:id/summarize", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const noteResult = await pool.query(
            "SELECT * FROM notes WHERE id = $1 AND user_id = $2",
            [id, req.user.id]
        );
        if (noteResult.rows.length === 0) {
            return res.status(404).json({ error: "Note not found" });
        }

        const note = noteResult.rows[0];

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Summarize the following note concisely." },
                { role: "user", content: note.content }
            ],
            max_tokens: 100
        });

        const summary = response.choices[0].message.content;

        await pool.query("UPDATE notes SET summary = $1 WHERE id = $2", [summary, id]);

        res.json({ success: true, summary });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to summarize note" });
    }
});

/**
 * Translate a note
 */
router.post("/:id/translate", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { lang } = req.body;

    try {
        const noteResult = await pool.query(
            "SELECT * FROM notes WHERE id = $1 AND user_id = $2",
            [id, req.user.id]
        );
        if (noteResult.rows.length === 0) {
            return res.status(404).json({ error: "Note not found" });
        }

        const note = noteResult.rows[0];

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: `Translate the following note into ${lang}.` },
                { role: "user", content: note.content }
            ],
            max_tokens: 300
        });

        const translatedText = response.choices[0].message.content;

        await pool.query(
            "UPDATE notes SET translation = translation || $1::jsonb WHERE id = $2",
            [JSON.stringify([{ lang, text: translatedText }]), id]
        );

        res.json({ success: true, translation: { lang, text: translatedText } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to translate note" });
    }
});

export default router;
