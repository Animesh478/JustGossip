const { addMessage } = require("../services/message.service");

const sendMessage = function (req, res) {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if(!message || message.trim()===""){
    return res.status(400).json({error: "Message cannot be empty"})
    }

    const newMessage = await addMessage(userId, message);
    return res.status(201).json({success: true, data: newMessage})
  } catch (error) {
    res.status(500).json({error: "Internal server error"})
  }
};

module.exports = {
  sendMessage,
};
