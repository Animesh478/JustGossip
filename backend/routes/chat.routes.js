const express = require("express");
const {
  accessOrCreateChat,
  fetchAllChats,
} = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const chatRouter = express.Router();

chatRouter.route("/access").post(authMiddleware, accessOrCreateChat);
chatRouter.route("/all-chats").get(authMiddleware, fetchAllChats);

module.exports = chatRouter;
