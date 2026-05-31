const signUpController = function (req, res) {
  const userData = req.body;
  console.log(userData);
  res.status(201).json({ message: "Created", data: userData });
};

const loginController = function (req, res) {
  const userCredentials = req.body;
  console.log(userCredentials);
  res.status(200).json({ message: "Login successful" });
};

module.exports = {
  signUpController,
  loginController,
};
