const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const blogsRoute = require("../blog-service/routes/blogRoutes");
require("dotenv").config();
const path = require("path");
const config = require("../blog-service/config/config");
const mongoose = require("mongoose");
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  res.status(500).send("Something broke in blogs service!");
});

const PORT = process.env.PORT || config.PORT || 3004;
app.listen(PORT, () => console.log(`Blogs service running on ${PORT}`));
