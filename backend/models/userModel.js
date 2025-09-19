import { pool } from '../db.js';

export const createUser = async (username, email, password_hash) => {
    const result = await pool.query(
        'INSERT INTO users(username, email, password_hash) VALUES($1,$2,$3) RETURNING *',
        [username, email, password_hash]
    );
    return result.rows[0];
};

export const getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    return result.rows[0];
};
