const express = require("express");
const authenticationRouter = require("./routes/authentication.routes");
const messageRouter = require("./routes/message.routes");

const PORT = 8000;

const app = express();
app.use(express.json());
app.use("/api/user-auth", authenticationRouter);
app.use("/api/chats", messageRouter);

app.listen(PORT, () => {
  console.log("server is running on ", PORT);
});
