const http = require("http");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
require("dotenv").config();

const authenticationRouter = require("./routes/authentication.routes");
const messageRouter = require("./routes/message.routes");
const userRouter = require("./routes/user.routes");

const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use("/api/user-auth", authenticationRouter);
app.use("/api/chats", messageRouter);
app.use("/api/user", userRouter);

io.on("connection", (socket) => {
  console.log("socket is connected", socket.id);
});

server.listen(PORT, () => {
  console.log("server is running on ", PORT);
});
