const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authenticationRouter = require("./routes/authentication.routes");
const messageRouter = require("./routes/message.routes");

const PORT = process.env.PORT;

const app = express();
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

app.listen(PORT, () => {
  console.log("server is running on ", PORT);
});
