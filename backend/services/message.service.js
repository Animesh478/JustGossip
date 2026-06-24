const { Message, User } = require("../models/index");

const addMessage = async function (userId, message, chatId) {
  console.log("inside message");
  const newMessage = await Message.create({
    senderId: userId,
    message,
    chatId,
  });

  const fullMessage = await Message.findByPk(newMessage.id, {
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "username", "profilePictureUrl"],
      },
    ],
  });
  if (!fullMessage) throw new Error("cannot add message");

  return fullMessage;
};

const fetchMessage = async function (chatId) {
  const messages = await Message.findAll({
    where: {
      chatId,
    },
    order: [["created_at", "ASC"]],
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "username", "profilePictureUrl"],
      },
    ],
  });
  return messages;
};

module.exports = {
  addMessage,
  fetchMessage,
};
