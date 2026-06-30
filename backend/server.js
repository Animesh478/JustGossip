const { createServer } = require("http");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./services/archiveMessages.service");

const authenticationRouter = require("./routes/authentication.routes");
const messageRouter = require("./routes/message.routes");
const userRouter = require("./routes/user.routes");
const chatRouter = require("./routes/chat.routes");
const initializeSocket = require("./sockets");
const aiRouter = require("./routes/aiChat.routes");

const PORT = process.env.PORT;

const app = express();
const server = createServer(app);
initializeSocket(server);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use("/api/user-auth", authenticationRouter);
app.use("/api/messages", messageRouter);
app.use("/api/user", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/aiChats", aiRouter);

server.listen(PORT, () => {
  console.log("server is running on ", PORT);
});
