const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_picture: {
      type: String,
      default: "https://your-default-avatar-url.com/default.png",
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    location: {
      type: String,
    },
    website: {
      type: String,
    },
    social_links: {
      type: Map,
      of: String, // Example: { github: '...', linkedin: '...' }
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    chat_status: {
      type: String,
      enum: ["online", "offline", "away"],
      default: "offline",
    },
    preferences: {
      type: Map,
      of: String, // Can store theme, notification preferences, etc.
    },
    last_login_at: {
      type: Date,
    },
    online: { type: Boolean, default: false },
    lastSeen: { type: Date },
    socketId: { type: String },
    unreadCount: { type: Number, default: 0 },
    reset_password_token: { type: String },
    reset_password_expires: { type: Date },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// module.exports = mongoose.model('User', UserSchema);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
