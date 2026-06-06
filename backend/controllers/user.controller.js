const { search } = require("../routes/user.routes");
const { fetchUser } = require("../services/user.service");

const searchUser = async function (req, res) {
  try {
    const { phoneNumber } = req.body;
    const user = await fetchUser(phoneNumber);
    console.log(user);
    if (user.id === req.user.id) {
      return res.status(400).json({ error: "You cannot chat with yourself" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  searchUser,
};
