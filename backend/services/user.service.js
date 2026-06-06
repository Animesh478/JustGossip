const { User } = require("../models/index");
const { validatePhoneNumber } = require("../utils/validatePhone");

const fetchUser = async function (phoneNumber) {
  const normalizedNumber = validatePhoneNumber(phoneNumber);
  const user = await User.findOne({
    where: {
      phoneNumber: normalizedNumber,
    },
    attributes: ["id", "username", "phoneNumber"],
    raw: true,
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 400;
    throw error;
  }

  return user;
};

module.exports = {
  fetchUser,
};
