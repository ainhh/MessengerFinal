const express = require('express');
const {
  createMessage,
  getMessages,
} = require('../Controllers/messageController');
const upload = require('../Middleware/upload');

const router = express.Router();

router.post('/sendMessage', upload.single('file'), createMessage);
router.get('/:chatId', getMessages);

module.exports = router;
