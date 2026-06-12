const {
  accessOrCreateChatService,
  getAllChats,
} = require("../services/chat.service");

// when frontend hits the /api/chats/getAllChats route
const fetchAllChats = async function (req, res) {
  try {
    const currentUserId = req.user.id;
    const formattedChats = await getAllChats(currentUserId);
    return res.status(200).json(formattedChats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

const accessOrCreateChat = async function (req, res) {
  const senderId = req.user.id;
  const { targetUserId } = req.body;

  if (!senderId || !targetUserId)
    return res.status(400).json({ message: "Missing user IDs" });

  const data = await accessOrCreateChatService(senderId, targetUserId);
  return res.status(200).json(data);

  try {
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  accessOrCreateChat,
  fetchAllChats,
};
