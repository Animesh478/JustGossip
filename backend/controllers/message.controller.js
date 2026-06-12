const { addMessage, fetchMessage } = require("../services/message.service");

const sendMessage = async function (req, res) {
  try {
    console.log("inside message controller");
    const userId = req.user.id;
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const newMessage = await addMessage(userId, message);
    return res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

const getMessage = async function (req, res) {
  // const userDetails = req.user;
  // const userId = userDetails.id;
  const chatId = req.params.chatId;

  try {
    const messages = await fetchMessage(chatId);
    res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessage,
};
