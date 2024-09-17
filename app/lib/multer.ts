// lib/multer.ts

import multer from 'multer';
import path from 'path';

// Set up storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`); // Rename file to avoid conflicts
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

export default upload;
