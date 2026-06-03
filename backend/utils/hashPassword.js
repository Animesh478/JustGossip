const bcrypt = require("bcrypt");

// Hash the password before storing in the db
const createHashedPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// Compare the password given by the user with the one in the db
const compareHashedPassword = async function (password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createHashedPassword,
  compareHashedPassword,
};
