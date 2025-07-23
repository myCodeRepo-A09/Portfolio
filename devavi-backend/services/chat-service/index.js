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
mongoose.connect("mongodb://localhost:27017/chatapp");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/chats", chatRoutes);
app.use("/upload", uploadRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ userId, friendId }) => {
    const room = [userId, friendId].sort().join("_");
    socket.join(room);
  });

  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, message, type } = data;
    const room = [senderId, receiverId].sort().join("_");
    await Chat.create(data);
    io.to(room).emit("newMessage", data);
  });
});

app.listen(4000, () => console.log("Backend on 4000"));
