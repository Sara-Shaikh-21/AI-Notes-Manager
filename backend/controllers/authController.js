const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    try {
        const hashed = await bcrypt.hash(password, 10);
        const result = await db.query(
            `INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name`,
            [email, hashed, name || null]
        );
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ user, token });
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ message: 'Email already exists' });
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT id, email, password, name FROM users WHERE email = $1', [email]);
        if (!result.rows.length) return res.status(401).json({ message: 'Invalid credentials' });
        const user = result.rows[0];
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        delete user.password;
        res.json({ user, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.me = async (req, res) => {
    try {
        const result = await db.query('SELECT id, email, name FROM users WHERE id = $1', [req.user.id]);
        if (!result.rows.length) return res.status(404).json({ message: 'User not found' });
        res.json({ user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};