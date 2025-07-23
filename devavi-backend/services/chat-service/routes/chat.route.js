const express = require("express");
const Chat = require("../models/chat.model");
const router = express.Router();

router.get("/:userId/:friendId", async (req, res) => {
  const { userId, friendId } = req.params;
  const messages = await Chat.find({
    $or: [
      { senderId: userId, receiverId: friendId },
      { senderId: friendId, receiverId: userId },
    ],
  }).sort({ timestamp: 1 });
  res.json(messages);
});

module.exports = router;
