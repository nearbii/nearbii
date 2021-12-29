const jwt = require("jsonwebtoken");

const tokenCreater = (user) => (secretKey) => (expirySeconds) => {
  return jwt.sign(
    {
      user,
    },
    secretKey,
    {
      expiresIn: expirySeconds,
    }
  );
};

const verifyToken = (token) => (secretKey) =>
  jwt.verify(token, secretKey, (err, tokenData) => {
    if (!err) return tokenData;
    return false;
  });

module.exports = {
  tokenCreater,
  verifyToken,
};
