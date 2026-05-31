const express = require("express");
const {
  signUpController,
  loginController,
} = require("../controllers/authentication.controller");
const authenticationRouter = express.Router();

authenticationRouter.post("/signup", signUpController);
authenticationRouter.post("/login", loginController);

module.exports = authenticationRouter;
