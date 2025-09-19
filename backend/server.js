require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');


app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));