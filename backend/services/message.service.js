const { Message } = require("../models/index");

const addMessage = async function (userId, message) {
  console.log("inside message");
  const newMessage = await Message.create({
    senderId: userId,
    message,
  });
  if (!newMessage) throw new Error("cannot add message");

  return newMessage;
};

const fetchMessage = async function (chatId) {
  const messages = await Message.findAll({
    where: {
      chatId,
    },
    order: [["created_at", "ASC"]],
  });
  return messages;
};

module.exports = {
  addMessage,
  fetchMessage,
};
