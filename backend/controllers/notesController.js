import pool from "../db.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const createNote = async (req, res) => {
    const { content } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO notes (user_id, content) VALUES ($1,$2) RETURNING *",
            [req.user.id, content]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getNotes = async (req, res) => {
    const result = await pool.query("SELECT * FROM notes WHERE user_id=$1", [req.user.id]);
    res.json(result.rows);
};

export const summarizeNote = async (req, res) => {
    const { content } = req.body;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: `Summarize this: ${content}` }]
        });
        res.json({ summary: response.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const translateNote = async (req, res) => {
    const { content, lang } = req.body;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: `Translate this into ${lang}: ${content}` }]
        });
        res.json({ translation: response.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
