const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const blogsRoute = require("../blog-service/routes/blogRoutes");
require("dotenv").config();
const path = require("path");
const { config } = require("../blog-service/config/config");
const mongoose = require("mongoose");
const { errorMiddleware } = require("../../shared/middleware/error.middleware");

//cors config
app.use(
  cors({
    origin: "*",
  })
);

//third party middlewares
app.use(helmet());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

//mongoose connection
mongoose
  .connect(process.env.MONGO_URI || config.MONGO_URI)
  .then(() => console.log("Blogs Mongo Connected"))
  .catch((err) => console.error(err));

//routes
app.use("/blogs", blogsRoute);

//Error Handling
app.use(errorMiddleware);

//start server
const PORT = process.env.PORT || config.PORT || 3004;
app.listen(PORT, () => console.log(`Blogs service running on ${PORT}`));
