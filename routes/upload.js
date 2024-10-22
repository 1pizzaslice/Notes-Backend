const express = require('express');
const upload = require('../config/multer');  // Correctly import the Multer config
const router = express.Router();  // Use 'router' instead of 'app'

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({
    message: 'File uploaded successfully',
    file: req.file
  });
});

router.post('/upload-multiple', upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  res.status(200).json({
    message: 'Files uploaded successfully',
    files: req.files
  });
});

module.exports = router;
