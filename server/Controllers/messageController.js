const messageModel = require('../Models/messageModel');
const upload = require('../Middleware/upload');

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const file = req.file;

  try {
    let message = {
      chatId,
      senderId,
      text,
    };

    if (file) {
      message.file = {
        path: file.path,
        filename: file.filename,
        mimetype: file.mimetype,
      };
    }

    const newMessage = new messageModel(message);
    const response = await newMessage.save();

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create message' });
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await messageModel.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { createMessage, getMessages };
