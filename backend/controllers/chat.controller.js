const {
  accessOrCreateChatService,
  getAllChats,
  createGroupChatService,
} = require("../services/chat.service");

// when frontend hits the /api/chats/getAllChats route
const fetchAllChats = async function (req, res) {
  try {
    const currentUserId = req.user.id;
    const formattedChats = await getAllChats(currentUserId);
    console.log("chat.controller, formattedChats = ", formattedChats);
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

const createGroupChat = async function (req, res) {
  const { groupName, memberIds } = req.body;
  const currentUser = req.user.id;

  try {
    if (!groupName || memberIds.length < 2) {
      return res
        .status(400)
        .json({ message: "A group requires atleast 2 users" });
    }

    const chatParticipants = [...memberIds, currentUser];

    const fullGroupChat = await createGroupChatService(
      chatParticipants,
      groupName,
      currentUser,
    );

    console.log("chat.controller.js, fullGroupChat = ", fullGroupChat);
    res.status(201).json(fullGroupChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create group chat" });
  }
};

module.exports = {
  accessOrCreateChat,
  fetchAllChats,
  createGroupChat,
};
