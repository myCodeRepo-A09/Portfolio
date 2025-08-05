const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const blogsRoute = require("../blog-service/routes/blogRoutes");
require("dotenv").config();
const path = require("path");
const config = require("../blog-service/config/config");
const mongoose = require("mongoose");
app.use(
  cors({
    origin: "*",
  })
);
app.use(helmet());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

mongoose
  .connect(
    process.env.MONGO_URI ||
      config.MONGO_URI ||
      "mongodb://localhost:27017/portfolio"
  )
  .then(() => console.log("Blogs Mongo Connected"))
  .catch((err) => console.error(err));

app.use("/blogs", blogsRoute);

app.use((err, req, res, next) => {
  res
    .status(500)
    .json({ message: "Something broke in blogs service!", error: err.message });
});

const PORT = process.env.PORT || config.PORT || 3004;
app.listen(PORT, () => console.log(`Blogs service running on ${PORT}`));
