const { addMessage, fetchMessage } = require("../services/message.service");

const sendMessage = async function (req, res) {
  try {
    // console.log("inside message controller");
    const userId = req.user.id;
    const { message, chatId } = req.body;

    if (!message || message.trim() === "" || !chatId) {
      return res
        .status(400)
        .json({ error: "Message and chat id are required" });
    }

    const newMessage = await addMessage(userId, message, chatId);
    return res.status(201).json(newMessage);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

const getMessage = async function (req, res) {
  const chatId = req.params.chatId;

  try {
    const messages = await fetchMessage(chatId);
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessage,
};
