const { User } = require("../models/index");
const { validatePhoneNumber } = require("../utils/validatePhone");
const {
  createHashedPassword,
  compareHashedPassword,
} = require("../utils/hashPassword");
const { createJWT } = require("../utils/jwtAuth");

const signupUser = async function (userData) {
  const email = userData.email.trim().toLowerCase();
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // validate the phone number and check whether it is already in use
  const phoneNumber = validatePhoneNumber(userData.phoneNumber);
  const existingNumber = await User.findOne({ where: { phoneNumber } });
  if (existingNumber) {
    throw new Error("The number is already in use");
  }
  const hashedPassword = await createHashedPassword(userData.password);

  const user = await User.create({
    username: userData.name,
    email,
    passwordHash: hashedPassword,
    phoneNumber,
  });
};

const loginUser = async function (userData) {
  const { email, password } = userData;

  const existingUserInstance = await User.findOne({ where: { email } });
  if (!existingUserInstance) {
    const error = new Error("Invalid email");
    error.statusCode = 401;
    throw error;
  }

  const existingUser = existingUserInstance.toJSON();

  const isMatch = await compareHashedPassword(
    password,
    existingUser.passwordHash,
  );
  if (!isMatch) {
    const error = new Error("Invalid password");
    error.statusCode = 401;
    throw error;
  }

  const token = createJWT(existingUser);
  return token;
};

module.exports = {
  signupUser,
  loginUser,
};
