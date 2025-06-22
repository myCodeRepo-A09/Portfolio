const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: String,
    imagesPath: [String],
    content: String,
    tags: [String],
    excerpt: String,
    status: String,
    githubLink: String,
    demoVideoPath: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
