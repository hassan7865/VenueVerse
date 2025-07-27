const jwt = require("jsonwebtoken");
const throwError = require("./error.js");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(throwError(401, "Session ended. Please log in again."));
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(throwError(403, "Invalid token."));
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
