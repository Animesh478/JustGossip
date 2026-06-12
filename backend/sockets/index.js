const { Server } = require("socket.io");

const initializeSocket = function (server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ New Connection! Socket ID: ${socket.id}`);
    socket.on("join_chat", ({ chatId }) => {
      // console.log(chat);
      const roomId = `room_${chatId}`;
      socket.join(roomId);
      console.log(`✅ Socket ${socket.id} joined ${roomId}`);
    });

    //? here we are listening for the send_message event. this event gets triggered when the user sends a message
    //todo: now i have to send this message to the intended receiver
    socket.on("send_message", (newMessage) => {
      // newMessage = {id, chatId, message, senderId, createdAt, updatedAt}
      // console.log("send message=", newMessage);
      const roomId = `room_${newMessage.chatId}`;

      console.log(`\n📩 ---> Message received from ${socket.id}`);
      console.log(`Intended target: ${roomId}`);
      console.log(`Current rooms for this socket:`, Array.from(socket.rooms));

      socket.to(roomId).emit("receive_message", newMessage); // i am  sending the message object
      console.log(`📤 <--- Broadcasted to ${roomId} (excluding sender)`);
    });

    socket.on("disconnect", () => {
      console.log("Connection disconnected");
    });
  });
};

module.exports = initializeSocket;
