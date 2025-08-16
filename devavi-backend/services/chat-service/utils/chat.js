const Message = require("../models/chat.model");
const User = require("../models/user.model");

const connectedUsers = new Map(); // userId => socket.id

module.exports = function (socket, io) {
  console.log(" New client connected");

  // Store user on connection
  socket.on("register-user", async (userId) => {
    try {
      connectedUsers.set(userId, socket.id);
      //console.log(`User ${userId} connected with socket ID: ${socket.id}`);
      await User.findByIdAndUpdate(userId, {
        online: true,
        socketId: socket.id,
        lastSeen: new Date(),
      });

      io.emit("user-status-update", { userId, online: true });
    } catch (err) {
      console.error("Error registering user:", err.message);
      socket.emit("error", { message: "Failed to register user" });
    }
  });

  // Send message
  socket.on("send-message", async (data) => {
    try {
      const { senderId, receiverId, content, messageType, fileMeta } = data;

      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        content,
        messageType,
        fileMeta,
      });

      await message.save();

      // Emit to receiver if online
      const receiverSocket = connectedUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive-message", message);
      }

      // Acknowledge sender
      socket.emit("message-sent", message);
    } catch (err) {
      console.error("Error sending message:", err.message);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Read receipt
  socket.on("read-message", async ({ messageId, userId }) => {
    try {
      await Message.updateOne(
        { _id: messageId },
        {
          $addToSet: {
            readBy: {
              user: userId,
              readAt: new Date(),
            },
          },
        }
      );

      // Notify sender
      const msg = await Message.findById(messageId).lean();
      const senderSocket = connectedUsers.get(msg?.sender?.toString());

      if (senderSocket) {
        io.to(senderSocket).emit("message-read", { messageId, userId });
      }
    } catch (err) {
      console.error("Error marking message as read:", err.message);
      socket.emit("error", { message: "Failed to mark message as read" });
    }
  });

  // Disconnect
  socket.on("disconnect", async () => {
    const userId = [...connectedUsers.entries()].find(
      ([, sid]) => sid === socket.id
    )?.[0];
    if (userId) {
      connectedUsers.delete(userId);
      await User.findByIdAndUpdate(userId, {
        online: false,
        lastSeen: new Date(),
      });
      io.emit("user-status-update", { userId, online: false });
    }
    console.log("Client disconnected");
  });

  socket.on("mark-as-read", async ({ senderId, receiverId }) => {
    try {
      // Update all unread messages from sender to receiver
      await Message.updateMany(
        { sender: senderId, receiver: receiverId, read: false },
        { $set: { read: true, readAt: new Date() } }
      );

      // Notify sender that messages have been read
      const senderSocket = onlineUsers.get(senderId); // stored in Step 2
      if (senderSocket) {
        senderSocket.emit("messages-read", {
          by: receiverId,
        });
      }
    } catch (err) {
      console.error("Error marking messages as read:", err.message);
    }
  });

  socket.on("get-all-users", async () => {
    try {
      console.log("Fetching all users");
      const users = await User.find({ status: "active" }).select(
        "name username email online lastSeen chat_status"
      );

      console.log("All users fetched:", users.length);
      socket.emit("all-users", users);
    } catch (err) {
      console.error("Error fetching users:", err.message);
      socket.emit("error", { message: "Failed to fetch users" });
    }
  });

  socket.on("get-user-status", async (userId) => {
    try {
      const user = await User.findById(userId).select(
        "name username email online lastSeen chat_status"
      );
      socket.emit("user-status", user);
    } catch (err) {
      console.error("Error fetching user status:", err.message);
      socket.emit("error", { message: "Failed to fetch user status" });
    }
  });

  socket.on("get-user-by-id", async (userId) => {
    try {
      const user = await User.findById(userId).select(
        "name username email online lastSeen chat_status"
      );
      socket.emit("user-found", user);
    } catch (err) {
      console.error("Error fetching user by ID:", err.message);
      socket.emit("error", { message: "Failed to fetch user by ID" });
    }
  });

  socket.on(
    "get-user-messages",
    async ({ userId1, userId2, page = 1, limit = 20 }) => {
      try {
        const messages = await Message.find({
          $or: [
            { sender: userId1, receiver: userId2 },
            { sender: userId2, receiver: userId1 },
          ],
        })
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean();

        socket.emit("user-messages", messages);
      } catch (err) {
        console.error("Error fetching user messages:", err.message);
        socket.emit("error", { message: "Failed to fetch user messages" });
      }
    }
  );
};
