const { accessOrCreateChatService } = require("../services/chat.service");

const accessOrCreateChat = async function (req, res) {
  const senderId = req.user.id;
  const { targetUserId } = req.body;

  if (!senderId || !targetUserId)
    return res.status(400).json({ message: "Missing user IDs" });

  const data = await accessOrCreateChatService(senderId, targetUserId);
  return res.status(200).json({ data });

  try {
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  accessOrCreateChat,
};
