const { Server } = require("socket.io");

const initializeSocket = function (server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join_chat", () => {});
    socket.on("send_message", () => {});
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
