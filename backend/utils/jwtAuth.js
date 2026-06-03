require("dotenv").config();
const jwt = require("jsonwebtoken");

const createJWT = function (user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.fullName,
    phoneNumber: user.phoneNumber,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

module.exports = {
  createJWT,
};
