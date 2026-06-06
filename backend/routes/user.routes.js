const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { searchUser } = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.route("/").post(authMiddleware, searchUser);

module.exports = userRouter;
