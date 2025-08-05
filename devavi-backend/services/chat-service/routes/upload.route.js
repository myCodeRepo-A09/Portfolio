const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const Message = require("../models/chat.model");

router.post("/upload", upload.single("file"), async (req, res) => {
  const { senderId, receiverId, messageType } = req.body;

  const fileMeta = {
    fileName: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    path: `/uploads/${req.file.filename}`,
  };

  const message = new Message({
    sender: senderId,
    receiver: receiverId,
    messageType,
    fileMeta,
  });

  await message.save();

  res.status(200).json({ message });
});

module.exports = router;
