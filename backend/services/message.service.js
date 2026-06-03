const { Message } = require("../models/index");

const addMessage = async function (userId, message) {
  const newMessage = await Message.create({
    senderId: userId,
    message,
  });

  return newMessage;
};

module.exports = {
  addMessage,
};
