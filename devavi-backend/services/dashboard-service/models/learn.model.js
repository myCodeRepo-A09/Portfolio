const mongoose = require("mongoose");

const learnSchema = new mongoose.Schema(
  {
    title: String,
    imagesPath: [String],
    content: String,
    excerpt: String,
    slug: String,
    status: String,
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Learn", learnSchema);
