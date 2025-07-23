const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  message: String, // message text or attachment URL
  type: { type: String, enum: ["text", "attachment"], default: "text" },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatSchema);
