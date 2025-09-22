import express from "express";
import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

// register
router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
        const r = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
            [email, hashed]
        );
        res.json({ user: r.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Email already used" });
    }
});

// login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const r = await pool.query(
        "SELECT id, email, password FROM users WHERE email=$1",
        [email]
    );
    const user = r.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid creds" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid creds" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, email: user.email } });
});

export default router;
