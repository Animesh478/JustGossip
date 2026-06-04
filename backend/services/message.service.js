const { Messages } = require("../models/index");

const addMessage = async function (userId, message) {
  console.log("inside message");
  const newMessage = await Messages.create({
    senderId: userId,
    message,
  });
  if (!newMessage) throw new Error("cannot add message");

  return newMessage;
};

module.exports = {
  addMessage,
};
