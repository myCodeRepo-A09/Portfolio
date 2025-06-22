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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
