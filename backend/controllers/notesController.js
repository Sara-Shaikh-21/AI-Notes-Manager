const db = require('../db');
console.error(err);
res.status(500).json({ message: 'Server error' });


exports.deleteNote = async (req, res) => {
    try {
        await db.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


// Summarize using OpenAI (Chat Completions / GPT)
exports.summarizeNote = async (req, res) => {
    try {
        const noteRes = await db.query('SELECT content FROM notes WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        if (!noteRes.rows.length) return res.status(404).json({ message: 'Not found' });
        const content = noteRes.rows[0].content;


        const prompt = `Summarize the following text in 2-3 sentences, keep it concise:\n\n${content}`;


        const ai = await openai.createChatCompletion({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 200,
        });


        const summary = ai.data.choices[0].message.content.trim();


        // store summary in notes table (optional column summary)
        await db.query('UPDATE notes SET summary = $1 WHERE id = $2', [summary, req.params.id]);


        res.json({ summary });
    } catch (err) {
        console.error(err?.response?.data || err);
        res.status(500).json({ message: 'AI error' });
    }
};


exports.translateNote = async (req, res) => {
    const { target = 'Spanish' } = req.body; // default Spanish
    try {
        const noteRes = await db.query('SELECT content FROM notes WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        if (!noteRes.rows.length) return res.status(404).json({ message: 'Not found' });
        const content = noteRes.rows[0].content;


        const prompt = `Translate the following text into ${target} preserving meaning and tone:\n\n${content}`;


        const ai = await openai.createChatCompletion({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 500,
        });


        const translation = ai.data.choices[0].message.content.trim();


        res.json({ translation });
    } catch (err) {
        console.error(err?.response?.data || err);
        res.status(500).json({ message: 'AI error' });
    }
};