let onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("addUser", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("getUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
      const receiverSocket = onlineUsers.get(receiverId);

      if (receiverSocket) {
        io.to(receiverSocket).emit("getMessage", {
          senderId,
          message,
        });
      }
    });

    socket.on("disconnect", () => {
      for (let [userId, sockId] of onlineUsers) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io.emit("getUsers", Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = socketHandler;