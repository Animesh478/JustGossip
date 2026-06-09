const http = require("http");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
require("dotenv").config();

const authenticationRouter = require("./routes/authentication.routes");
const messageRouter = require("./routes/message.routes");
const userRouter = require("./routes/user.routes");
const chatRouter = require("./routes/chat.routes");

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(cookieParser());
app.use("/api/user-auth", authenticationRouter);
app.use("/api/messages", messageRouter);
app.use("/api/user", userRouter);
app.use("/api/chats", chatRouter);

io.on("connection", (socket) => {
  console.log("socket is connected", socket.id);

  // event: user clicks on a chat in the sidebar
  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat room: ${chatId}`);
  });

  // event: user clicks "send" on a message
  socket.on("send_message", (messageData) => {
    // broadcast the message only to the users inside that specific chatId room
    socket.to(messageData.chatId).emit("receive_message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("server is running on ", PORT);
});
