const {
  Message,
  ArchivedMessages,
  User,
  ChatParticipants,
} = require("../models/index");
const { Op } = require("sequelize");

const addMessage = async function (userId, message, chatId) {
  // check whether a record exists linking this user to this chat
  const isParticipant = await ChatParticipants.findOne({
    where: {
      chatId,
      userId,
    },
  });

  if (!isParticipant) {
    throw new Error("Unauthorized: User is not a part of this chat");
  }

  // console.log("inside message");
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

const fetchMessage = async function (chatId, cursorDate, limit = 50) {
  const cutOffDate = new Date();
  cutOffDate.setDate(cutOffDate.getDate() - 30);

  let messages = [];

  // 1. fetch from active table
  // only query the active table if there is no cursor(initial load) or if the cursor is newer than 30 days
  // cursorDate: the date of the oldest message on the screen

  // eg: today- 5th july
  // cutoff date- 5th june
  // if the cursor date is 12th june, we can get those messages from the active table
  // if the cursor date is 1st june, we have to dive into the archived messages table to get the messages
  if (!cursorDate || new Date(cursorDate) > cutOffDate) {
    messages = await Message.findAll({
      where: {
        chatId,
        ...(cursorDate && { createdAt: { [Op.lt]: new Date(cursorDate) } }),
      },
      order: [["created_at", "DESC"]],
      limit: limit,
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "username", "profilePictureUrl"],
        },
      ],
    });
  }

  // 2. fetch from archived table
  // if the active table doesnot have enough messages(from the cutoff date) to fulfill the limit, we cross the cutoff date boundary and pull the rest of the messages from the archived table

  if (messages.length < limit) {
    const remainingLimit = limit - messages.length;

    // from where to start querying the archived messages table
    const archiveCursorDate =
      messages.length > 0
        ? messages[messages.length - 1].createdAt
        : cursorDate
          ? new Date(cursorDate)
          : new Date();

    const archivedMessages = await ArchivedMessages.findAll({
      where: {
        chatId,
        createdAt: { [Op.lt]: archiveCursorDate },
      },
      order: [["created_at", "DESC"]],
      limit: remainingLimit,
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "username", "profilePictureUrl"],
        },
      ],
    });

    // combine active and archived messages
    messages = [...messages, ...archivedMessages];
  }

  return messages.reverse();
};

module.exports = {
  addMessage,
  fetchMessage,
};
