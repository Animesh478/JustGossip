const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  sendMessage,
  getMessage,
} = require("../controllers/message.controller");

const messageRouter = express.Router();

messageRouter.route("/").post(authMiddleware, sendMessage);
messageRouter.route(`/:chatId`).get(authMiddleware, getMessage);

module.exports = messageRouter;
