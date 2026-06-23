const { Op } = require("sequelize");
const {
  ChatParticipants,
  Chat,
  User,
  Message,
  sequelize,
} = require("../models");

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
        // where: {
        //   id: {
        //     [Op.ne]: currentUserId, // get the user who is not the current user
        //   },
        // },
        attributes: ["id", "username", "phoneNumber", "profilePictureUrl"],
      },
      // {
      //   model: Message,
      //   as: "messages",
      //   limit: 1,
      //   order: [["created_at", "DESC"]], // get the latest message
      // },
    ],
  });

  // format the data that needs to be send to the frontend
  const formattedChats = await Promise.all(
    chats.map(async (chat) => {
      const latestMessage = await Message.findOne({
        where: { chatId: chat.id },
        order: [["updatedAt", "DESC"]],
      });

      console.log("chat.service, chats = ", chats);
      // const receiver =
      let chatDetails = {};

      if (chat.isGroup) {
        chatDetails = {
          isGroup: true,
          chatName: chat.name,
          participants: chat.participants,
          receiver: null,
        };
      } else {
        chatDetails = {
          isGroup: false,
          chatName: null,
          participants: chat.participants,
          receiver: chat.participants.filter(
            (participant) => participant.id !== currentUserId,
          )[0],
        };
      }

      return {
        chatId: chat.id,
        ...chatDetails,
        // senderId: latestMessage?.senderId || null,
        senderId: currentUserId,
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

    // find all the chats that are personal (exclude all the group chats)
    const personalChats = await Chat.findAll({
      where: {
        id: {
          [Op.in]: chatIds,
        },
        isGroup: false,
      },
    });

    const personalChatIds = personalChats.map((chat) => chat.id);
    console.log("PERSONAL CHAT IDS = ", personalChatIds);

    // 3- check if the target user is already in any of the personal chats
    const sharedChatParticipant = await ChatParticipants.findOne({
      where: {
        userId: targetUserId,
        chatId: {
          [Op.in]: personalChatIds,
        },
      },
    });
    // console.log("shared participant=", sharedChatParticipant);

    // Helper function to format the response for the frontend
    const formatForFrontend = (chatObj) => {
      // Find the participant who is NOT the sender
      const targetUser = chatObj.participants.find((p) => p.id !== senderId);
      return {
        chatId: chatObj.id,
        isGroup: chatObj.isGroup,
        receiver: {
          id: targetUser.id,
          username: targetUser.username,
          phoneNumber: targetUser.phoneNumber,
          profilePictureUrl: targetUser.profilePictureUrl,
        },
        // sender: chatObj.messages?.[0]?.senderId || null,
        sender: senderId,
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
            attributes: ["id", "username", "phoneNumber", "profilePictureUrl"],
          },
          {
            model: Message,
            as: "messages",
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
        ],
      });

      console.log("chat.service.js, existingChat=", existingChat);
      const formattedChat = formatForFrontend(existingChat);

      return formattedChat;
    }

    // 5- If there is no existing chat between the sender and the target, create a new one in the database
    const newChat = await Chat.create();
    console.log("chat.service.js, newChat = ", newChat);
    // 6- Add both users to the chat participants table
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
          attributes: ["id", "username", "phoneNumber", "profilePictureUrl"],
        },
        {
          model: Message,
          as: "messages",
        },
      ],
    });

    return formatForFrontend(completeNewChat);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const createGroupChatService = async function (
  participants,
  groupName,
  currentUser,
) {
  try {
    const newGroupChat = await sequelize.transaction(async (t) => {
      // create a chat record
      const chat = await Chat.create(
        {
          isGroup: true,
          name: groupName,
        },
        {
          transaction: t,
        },
      );

      // create the chat participants records
      const participantsToInsert = participants.map((id) => {
        return {
          chatId: chat.id,
          userId: id,
          isAdmin: id === currentUser,
        };
      });
      // participantsToInsert = [{chatId, userId, isAdmin}]

      await ChatParticipants.bulkCreate(participantsToInsert, {
        transaction: t,
      });

      return chat;
    });

    const fullGroupChat = await Chat.findOne({
      where: {
        id: newGroupChat.id,
      },
      attributes: [
        ["id", "chatId"],
        ["name", "chatName"],
        "isGroup",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: User,
          as: "participants",
          attributes: ["id", "username", "phoneNumber", "profilePictureUrl"],
        },
      ],
    });

    return fullGroupChat;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  accessOrCreateChatService,
  getAllChats,
  createGroupChatService,
};
