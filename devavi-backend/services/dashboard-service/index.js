require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const dashboardRoutes = require("./routes/dashboard.routes");
const { config } = require("./config/config");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
const path = require("path");

//connect database
mongoose
  .connect(process.env.MONGO_URI || config.MONGO_URI, {
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Dashboard Mongo Connected"))
  .catch((err) => console.error(err));

//serve routes
app.use("/dashboard", dashboardRoutes);

// Serve /uploads as static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//check health
app.get("/dashboard/health", (req, res) => res.send("OK"));

//catch errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

//run server
const PORT = process.env.PORT || config.PORT || 3001;
app.listen(PORT, () => console.log(`Dashboard running on ${PORT}`));
