const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    file: {
      path: {
        type: String,
      },
      filename: {
        type: String,
      },
      mimetype: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model('Message', messageSchema);

module.exports = messageModel;
