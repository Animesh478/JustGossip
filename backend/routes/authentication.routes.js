const express = require("express");
const { signUp, login } = require("../controllers/authentication.controller");
const authenticationRouter = express.Router();

authenticationRouter.post("/signup", signUp);
authenticationRouter.post("/login", login);

module.exports = authenticationRouter;
