const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRETKEY =
  process.env.ACCESS_TOKEN_SECRETKEY || "accesssecretkey";
const REFRESH_TOKEN_SECRETKEY =
  process.env.REFRESH_TOKEN_SECRETKEY || "refreshsecretkey";

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
};

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

const verifyToken = (secretKey) => (token) =>
  jwt.verify(token, secretKey, (err, tokenData) => {
    if (!err) return tokenData;
    return false;
  });

const verifyAccessToken = verifyToken(ACCESS_TOKEN_SECRETKEY);
const verifyRefreshToken = verifyToken(REFRESH_TOKEN_SECRETKEY);

module.exports = {
  tokenCreater,
  verifyAccessToken,
  verifyRefreshToken,
  catchError,
};
