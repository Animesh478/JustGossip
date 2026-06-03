require("dotenv").config();
const jwt = require("jsonwebtoken");

const createJWT = function (user) {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
    phoneNumber: user.phoneNumber,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

const verifyJwt = function (token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

module.exports = {
  createJWT,
  verifyJwt,
};
