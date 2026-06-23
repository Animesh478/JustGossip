const express = require("express");
const {
  accessOrCreateChat,
  fetchAllChats,
  createGroupChat,
} = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const chatRouter = express.Router();

chatRouter.route("/access").post(authMiddleware, accessOrCreateChat);
chatRouter.route("/all-chats").get(authMiddleware, fetchAllChats);
chatRouter.route("/groupChat").post(authMiddleware, createGroupChat);

module.exports = chatRouter;
