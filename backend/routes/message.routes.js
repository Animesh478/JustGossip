const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  sendMessage,
  getMessage,
  sendMediaMessage,
} = require("../controllers/message.controller");
const upload = require("../middlewares/multer.middleware");

const messageRouter = express.Router();

messageRouter.route("/").post(authMiddleware, sendMessage);
messageRouter.route(`/:chatId`).get(authMiddleware, getMessage);
messageRouter
  .route("/media")
  .post(authMiddleware, upload.single("file"), sendMediaMessage);

module.exports = messageRouter;
