const { Op } = require("sequelize");
const { ChatParticipants, Chat, User, Message } = require("../models");

// this function runs when we initially fetch all the chats
const getAllChats = async function (currentUserId) {
  // 1- find all the chat ids the current user is a part of
  const userChats = await ChatParticipants.findAll({
    where: {
      userId: currentUserId,
    },
    attributes: ["chatId"],
  });

  // console.log("user chats = ", userChats);

  const chatIds = userChats.map((chat) => chat.chatId);

  // 2- fetch all the chats for the corresponding chat ids, including the other participant and the latest message
  const chats = await Chat.findAll({
    where: {
      id: chatIds,
    },
    include: [
      {
        model: User,
        as: "participants",
        where: {
          id: {
            [Op.ne]: currentUserId, // get the user who is not the current user
          },
        },
        attributes: ["id", "username", "phoneNumber"],
      },

      // {
      //   model: Message,
      //   as: "messages",
      //   limit: 1,
      //   order: [["created_at", "DESC"]], // get the latest message
      // },
    ],
  });
  // console.log("get all chats = ", chats);

  // format the data that needs to be send to the frontend
  const formattedChats = await Promise.all(
    chats.map(async (chat) => {
      // console.log("chat id=", chat.id);
      const latestMessage = await Message.findOne({
        where: { chatId: chat.id },
        order: [["createdAt", "DESC"]],
      });
      // console.log("latest message=", latestMessage);
      return {
        chatId: chat.id,
        receiver: chat.participants[0],
        senderId: latestMessage?.senderId || null,
        lastMessage: latestMessage?.message || "Start a conversation",
        updatedAt: latestMessage?.updatedAt || chat.createdAt,
      };
    }),
  );
  // console.log("formatted chats=", formattedChats);
  return formattedChats;
};

const accessOrCreateChatService = async function (senderId, targetUserId) {
  try {
    // 1- find all chat IDs where the sender is a part of
    const senderChats = await ChatParticipants.findAll({
      where: {
        userId: senderId,
      },
      attributes: ["chatId"],
    });
    // console.log("sender-chats=", senderChats);

    // 2- extract just the chat id number
    const chatIds = senderChats.map((chat) => chat.chatId);
    // console.log("chat ids=", chatIds);

    // 3- check if the target user is already in any of these chats
    const sharedChatParticipant = await ChatParticipants.findOne({
      where: {
        userId: targetUserId,
        chatId: {
          [Op.in]: chatIds,
        },
      },
    });
    console.log("shared participant=", sharedChatParticipant);

    // Helper function to format the response for the frontend
    const formatForFrontend = (chatObj) => {
      console.log("chat obj=", chatObj);
      // Find the participant who is NOT the sender
      const targetUser = chatObj.participants.find((p) => p.id !== senderId);
      console.log("receiver=", targetUser);
      return {
        chatId: chatObj.id,
        receiver: {
          id: targetUser.id,
          username: targetUser.username,
          phoneNumber: targetUser.phoneNumber,
        },
        sender: chatObj.messages?.[0]?.senderId || null,
        lastMessage:
          chatObj.messages?.[0]?.message || "Start a conversation...",
        updatedAt: chatObj.messages?.[0]?.updatedAt || chatObj.createdAt,
      };
    };

    // 4- If they share a chat return the chat
    if (sharedChatParticipant) {
      const existingChat = await Chat.findOne({
        where: {
          id: sharedChatParticipant.chatId,
        },
        // Include target user attributes
        include: [
          {
            model: User,
            as: "participants",
            attributes: ["id", "username", "phoneNumber"],
          },
          {
            model: Message,
            as: "messages",
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
        ],
      });
      const formattedChat = formatForFrontend(existingChat);
      console.log("existing chat=", formattedChat);

      return formattedChat;
    }

    // 5- If there is no existing chat between the sender and the target, create a new one in the database
    const newChat = await Chat.create();

    // 6- Add both users to the chat participants table
    // await ChatParticipants.bulkCreate([
    //   { chatId: newChat.id, userId: senderId },
    //   { chatId: newChat.id, userId: targetUserId },
    // ]);
    await newChat.addParticipants([senderId, targetUserId]);

    // 7- fetch the newly created chat with the associated user data
    const completeNewChat = await Chat.findOne({
      where: {
        id: newChat.id,
      },
      include: [
        {
          model: User,
          as: "participants",
          attributes: ["id", "username", "phoneNumber"],
        },
        {
          model: Message,
          as: "messages",
        },
      ],
    });
    // console.log("new chat=", completeNewChat);
    return formatForFrontend(completeNewChat);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

module.exports = {
  accessOrCreateChatService,
  getAllChats,
};
