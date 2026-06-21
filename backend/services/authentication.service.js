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
    username: userData.username,
    email,
    passwordHash: hashedPassword,
    phoneNumber,
  });
};

const loginUser = async function (userData) {
  const { email, password } = userData;

  const existingUserInstance = await User.findOne({
    where: { email },
  });
  // console.log("existing user=", existingUserInstance);
  if (!existingUserInstance) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const existingUser = existingUserInstance.toJSON();

  const isMatch = await compareHashedPassword(
    password,
    existingUser.passwordHash,
  );
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = createJWT(existingUser);
  const user = await User.findOne({
    where: {
      email,
    },
    attributes: ["id", "username", "email", "phoneNumber", "profilePictureUrl"],
  });
  const data = {
    token,
    user,
  };
  return data;
};

const authenticateUser = async function (userData) {
  const user = await User.findOne({
    where: { email: userData.email },
    attributes: ["id", "username", "email", "phoneNumber", "profilePictureUrl"],
  });
  // console.log("user data=", user);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }

  return user;
};

module.exports = {
  signupUser,
  loginUser,
  authenticateUser,
};
