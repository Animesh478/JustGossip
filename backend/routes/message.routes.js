const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  sendMessage,
  getMessage,
} = require("../controllers/message.controller");

const messageRouter = express.Router();

messageRouter
  .route("/messages")
  .post(authMiddleware, sendMessage)
  .get(authMiddleware, getMessage);

module.exports = messageRouter;
