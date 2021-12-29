const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRETKEY =
  process.env.ACCESS_TOKEN_SECRETKEY || "accesssecretkey";
const TOKENLENGTHSECONDS = process.env.TOKENLENGTHSECONDS || 15;
const REFRESH_TOKEN_SECRETKEY =
  process.env.REFRESH_TOKEN_SECRETKEY || "refreshsecretkey";

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

module.exports = {
  tokenCreater,
};
