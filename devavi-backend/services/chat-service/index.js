const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const Chat = require("./models/chat.model");
const chatRoutes = require("./routes/chat.route");
const uploadRoutes = require("./routes/upload.route");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
const chatSocketHandler = require("./utils/chat");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/chats", chatRoutes);
app.use("/upload", uploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
connectDB();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  chatSocketHandler(socket, io);
});

app.listen(4000, () => console.log("Backend on 4000"));
