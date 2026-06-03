const { signupUser, loginUser } = require("../services/authentication.service");

const signUp = async function (req, res) {
  const userData = req.body;
  console.log(userData);

  if (!userData.email || !userData.password) {
    res.status(400).json({ message: "Email and password required" });
  }

  try {
    await signupUser(userData);
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async function (req, res) {
  const userCredentials = req.body;
  console.log(userCredentials);
  try {
    const token = await loginUser(userCredentials);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
};

module.exports = {
  signUp,
  login,
};
