const express = require('express');
const { handleAddRequest, handleReadRequest, handleReadRequestById, handleUpdateRequest, handleDeleteRequest } = require('../controllers/working');
const router = express.Router();


router.get('/notes' , handleReadRequest);

router.get('/notes/:id' , handleReadRequestById);

router.post('/notes' ,handleAddRequest );

router.put('/notes/:id' ,handleUpdateRequest );

router.delete('/notes/:id' ,handleDeleteRequest );

module.exports = router;

