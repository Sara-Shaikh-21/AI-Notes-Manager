import { pool } from '../db.js';

export const createNote = async (user_id, title, content) => {
    const result = await pool.query(
        'INSERT INTO notes(user_id, title, content) VALUES($1,$2,$3) RETURNING *',
        [user_id, title, content]
    );
    return result.rows[0];
};

export const getNotesByUser = async (user_id) => {
    const result = await pool.query('SELECT * FROM notes WHERE user_id=$1 ORDER BY created_at DESC', [user_id]);
    return result.rows;
};
