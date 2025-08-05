const Message = require("../models/chat.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content, messageType, fileMeta } = req.body;

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
      messageType,
      fileMeta,
    });

    await message.save();

    res.status(201).json({ message });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId1, userId2, page = 1, limit = 20 } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    await Message.updateOne(
      { _id: messageId },
      {
        $addToSet: {
          readBy: {
            user: new mongoose.Types.ObjectId(userId),
            readAt: new Date(),
          },
        },
      }
    );

    res.json({ message: "Read receipt updated" });
  } catch (error) {
    console.error("Mark Read Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
