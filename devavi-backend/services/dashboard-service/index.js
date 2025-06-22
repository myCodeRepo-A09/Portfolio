require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Dashboard Mongo Connected"))
  .catch((err) => console.error(err));

app.use("/api/dashboard", dashboardRoutes);

app.get("/health", (req, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Dashboard running on ${PORT}`));
