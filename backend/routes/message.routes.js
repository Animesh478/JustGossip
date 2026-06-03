const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { sendMessage } = require("../controllers/message.controller");

const messageRouter = express.Router();

messageRouter.route("/messages").post(authMiddleware, sendMessage);

module.exports = messageRouter;
