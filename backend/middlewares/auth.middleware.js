const { verifyJwt } = require("../utils/jwtAuth");

const authMiddleware = function (req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ error: "User unauthorized" });
  }

  try {
    const userPayload = verifyJwt(token);
    req.user = userPayload;
    next();
  } catch (error) {
    // if the token has expired
    res.clearCookie("access_token");
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
