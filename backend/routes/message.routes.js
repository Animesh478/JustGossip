const express = require("express");

const messageRouter = express.Router();

messageRouter.route("/message").post((req, res) => {
  res.send("message");
});

module.exports = messageRouter;
