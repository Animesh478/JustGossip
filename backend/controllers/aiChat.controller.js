const aiService = require("../services/aiChat.service");

const getSmartReplies = async function (req, res) {
  const { chatHistory, tone } = req.body;
  const replies = await aiService.generateSmartReplies(chatHistory, tone);
  res.status(200).json({ replies });
};

const getPredictiveText = async function (req, res) {
  const { draft, tone } = req.body;
  const suggestions = await aiService.generatePredictiveText(draft, tone);
  res.status(200).json({ suggestions });
};

module.exports = {
  getSmartReplies,
  getPredictiveText,
};
