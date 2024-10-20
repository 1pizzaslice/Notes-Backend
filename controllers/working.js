
const Note  = require('../models/notesSchema');
const mongoose = require('mongoose');

const handleReadRequest = async (req, res) => {
    try {
      const { status, sortBy } = req.query;
      let query = {};

      if (status) {
        query.status = status;
      }
  
      let notesQuery = Note.find(query); 
  
      if (sortBy) {
        const validSortFields = ['created_at', 'updated_at' ];
  
        // apply sorting if the sortBy field is valid
        if (validSortFields.includes(sortBy)) {
          const sortOptions = { [sortBy]: 1 };  
          notesQuery = notesQuery.sort(sortOptions);  
        } else {
          return res.status(400).json({ message: "Invalid sort field" });
        }
      }
  
      const results = await notesQuery.exec();  
      res.json(results);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const handleReadRequestById = async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid Note ID format' });
    }
    
    try {
        const note = await Note.findOne({ note_id: new mongoose.Types.ObjectId(req.params.id) });
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

  
  const handleAddRequest = async (req, res) => {
    try {
        const note = new Note(req.body);
        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
  
  const handleDeleteRequest = async (req, res) => {
    try {
        const note = await Note.findOne({ note_id: new mongoose.Types.ObjectId(req.params.id) });
        if (!note) return res.status(404).json({ message: 'Note not found' });

        await note.deleteOne();
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
  
  const handleUpdateRequest = async (req, res) => {
    try {
        const note = await Note.findOne({ note_id: new mongoose.Types.ObjectId(req.params.id) });

        if (!note) return res.status(404).json({ message: 'Note not found' });

        Object.assign(note, req.body);                // merge request body with the existing note data
        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};



module.exports = { 
    handleAddRequest,
    handleReadRequest,
    handleReadRequestById,
    handleUpdateRequest,
    handleDeleteRequest,  
};