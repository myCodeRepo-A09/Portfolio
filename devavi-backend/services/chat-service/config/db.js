const mongoose = require("mongoose");
const { config } = require("./config");
require("dotenv").config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Fault tolerance
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
