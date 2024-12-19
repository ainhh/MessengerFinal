const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image') ||
      file.mimetype.startsWith('application')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
});

module.exports = upload;
