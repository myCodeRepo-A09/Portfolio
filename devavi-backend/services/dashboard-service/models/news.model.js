const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: String,
    summary: String,
    imagePath: String,
    newsdatetime: Date,
    redirectLink: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);
