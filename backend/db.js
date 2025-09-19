const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // for Supabase: ssl: { rejectUnauthorized: false }
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});


module.exports = {
    query: (text, params) => pool.query(text, params),
};