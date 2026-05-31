const express = require("express");
const authenticationRouter = require("./routes/authentication.routes");
const PORT = 8000;

const app = express();
app.use(express.json())
app.use("/api/user-auth", authenticationRouter);

app.listen(PORT, () => {
  console.log("server is running on ", PORT);
});
