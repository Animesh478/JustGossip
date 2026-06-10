const { Op } = require("sequelize");
const { ChatParticipants, Chat, User } = require("../models");

const accessOrCreateChatService = async function (senderId, targetUserId) {
  try {
    // 1- find all chat IDs where the sender is a part of
    const senderChats = await ChatParticipants.findAll({
      where: {
        userId: senderId,
      },
      attributes: ["chatId"],
      //   raw: true,
    });
    console.log("sender-chats=", senderChats);

    // 2- extract just the chat id number
    const chatIds = senderChats.map((chat) => chat.chatId);
    console.log("chat ids=", chatIds);

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
        ],
        // raw: true,
      });
      console.log("existing chat=", existingChat);

      return existingChat;
    }

    // 5- If there is no existing chat between the sender and the target, create a new one
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
      ],
      //   raw: true,
    });
    console.log("new chat=", completeNewChat);
    return completeNewChat;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

module.exports = {
  accessOrCreateChatService,
};
