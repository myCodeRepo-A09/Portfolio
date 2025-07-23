const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: String,
    readTime: String,
    images: [String],
    videoPaths: [String],
    content: String,
    excerpt: String,
    slug: String,
    author_id: String,
    tags: [String],
    status: { type: String, enum: ["draft", "published", "archived"] },
    published_at: Date,
    comments: [
      {
        user: String,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    likes: { count: { type: Number, default: 0 }, user: [String] },
    views: { count: { type: Number, default: 0 }, user: [String] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
