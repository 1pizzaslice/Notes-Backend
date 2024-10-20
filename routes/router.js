const express = require('express');
const { handleAddRequest, handleReadRequest, handleReadRequestById, handleUpdateRequest, handleDeleteRequest } = require('../controllers/working');
const router = express.Router();


router.get('/GET/notes' , handleReadRequest);

router.get('/GET/notes/:id' , handleReadRequestById);

router.post('/POST/notes' ,handleAddRequest );

router.put('/PUT/notes/:id' ,handleUpdateRequest );

router.delete('/DELETE/notes/:id' ,handleDeleteRequest );

module.exports = router;

