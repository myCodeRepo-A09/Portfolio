const Message = require("../models/Message");
const User = require("../models/User");

const connectedUsers = new Map(); // userId => socket.id

module.exports = function (socket, io) {
  console.log("🔌 New client connected");

  // Store user on connection
  socket.on("register-user", async (userId) => {
    connectedUsers.set(userId, socket.id);
    await User.findByIdAndUpdate(userId, {
      online: true,
      socketId: socket.id,
      lastSeen: new Date(),
    });

    io.emit("user-status-update", { userId, online: true });
  });

  // Send message
  socket.on("send-message", async (data) => {
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
  });

  // Read receipt
  socket.on("read-message", async ({ messageId, userId }) => {
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
    console.log("🔌 Client disconnected");
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
      console.error("Error marking messages as read:", err);
    }
  });
};
