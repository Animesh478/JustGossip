const express = require("express");
const {
  signUp,
  login,
  authenticate,
} = require("../controllers/authentication.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authenticationRouter = express.Router();

authenticationRouter.post("/signup", signUp);
authenticationRouter.post("/login", login);
authenticationRouter.get("/me", authMiddleware, authenticate);

module.exports = authenticationRouter;
