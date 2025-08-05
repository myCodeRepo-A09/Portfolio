const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    displayName: { type: String },
    online: { type: Boolean, default: false },
    lastSeen: { type: Date },
    socketId: { type: String }, // Useful for real-time presence
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
