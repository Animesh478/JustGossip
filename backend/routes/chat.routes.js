const express = require("express");
const { accessOrCreateChat } = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const chatRouter = express.Router();

chatRouter.route("/access").post(authMiddleware, accessOrCreateChat);

module.exports = chatRouter;
