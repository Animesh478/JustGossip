const express = require("express");
const {
  getSmartReplies,
  getPredictiveText,
} = require("../controllers/aiChat.controller");
const aiRouter = express.Router();

aiRouter.route("/smartReplies").post(getSmartReplies);
aiRouter.route("/predictiveText").post(getPredictiveText);

module.exports = aiRouter;
