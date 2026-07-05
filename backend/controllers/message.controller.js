const { sendMedia } = require("../services/mediaShare.service");
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
  const cursorDate = req.query.cursorDate;

  try {
    const messages = await fetchMessage(chatId, cursorDate);
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const sendMediaMessage = async function (req, res) {
  const userId = req.user.id;
  const { chatId } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const result = await sendMedia(userId, chatId, file);
    res.status(201).json(result);
  } catch (error) {
    console.error("Media upload failed", error);
    res.status(500).json({ message: "Media upload failed" });
  }
};

module.exports = {
  sendMessage,
  getMessage,
  sendMediaMessage,
};
