const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRETKEY =
  process.env.ACCESS_TOKEN_SECRETKEY || "accesssecretkey";
const TOKENLENGTHSECONDS = process.env.TOKENLENGTHSECONDS || 15;
const REFRESH_TOKEN_SECRETKEY =
  process.env.REFRESH_TOKEN_SECRETKEY || "refreshsecretkey";

const tokenCreater = (secretKey) => (expirySeconds) => (user) => {
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

const generateAccessToken = tokenCreater(ACCESS_TOKEN_SECRETKEY)(
  TOKENLENGTHSECONDS
);

const generateRefreshToken = tokenCreater(REFRESH_TOKEN_SECRETKEY)(6000);

module.exports = {
  tokenCreater,
  generateAccessToken,
  generateRefreshToken,
};
