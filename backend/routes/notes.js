const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notes = require('../controllers/notesController');


router.post('/', auth, notes.createNote);
router.get('/', auth, notes.getNotes);
router.get('/:id', auth, notes.getNoteById);
router.put('/:id', auth, notes.updateNote);
router.delete('/:id', auth, notes.deleteNote);


// AI endpoints
router.post('/:id/summarize', auth, notes.summarizeNote);
router.post('/:id/translate', auth, notes.translateNote);


module.exports = router;