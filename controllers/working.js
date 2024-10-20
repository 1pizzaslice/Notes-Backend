
const Note  = require('../models/notesSchema');
const mongoose = require('mongoose');

const handleReadRequest = async (req, res) => {
    try {
      const { status, sortBy } = req.query;
      const userId = req.user._id;
      const isAdmin = req.user.isAdmin;

      let query = isAdmin ? {} : { createdBy: userId };

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
      const isAdmin = req.user.isAdmin;
      const userId = req.user._id;
  
      const query = isAdmin
        ? { _id: req.params.id }
        : { _id: req.params.id, createdBy: userId };  
  
      const note = await Note.findOne(query);
  
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
  
      res.json(note);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

  
const handleAddRequest = async (req, res) => {
  try {
    const userId = req.user._id; 

    const note = new Note({
      ...req.body,            
      createdBy: userId       
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
  
const handleDeleteRequest = async (req, res) => {
  try {
    const isAdmin = req.user.isAdmin;
    const userId = req.user._id;

    const query = isAdmin
      ? { _id: req.params.id } 
      : { _id: req.params.id, createdBy: userId };  

    const note = await Note.findOne(query);

    if (!note) {
      return res.status(404).json({ message: 'Note not found or you do not have permission to delete it' });
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


  
const handleUpdateRequest = async (req, res) => {
  try {
    const isAdmin = req.user.isAdmin;
    const userId = req.user._id;

    const query = isAdmin
      ? { _id: req.params.id }  
      : { _id: req.params.id, createdBy: userId }; 

    const note = await Note.findOne(query);

    if (!note) {
      return res.status(404).json({ message: 'Note not found or you do not have permission to update it' });
    }

    Object.assign(note, req.body);

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
