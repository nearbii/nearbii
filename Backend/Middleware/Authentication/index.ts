const { verifyToken } = require("../../jwt");

const ACCESS_TOKEN_SECRETKEY =
  process.env.ACCESS_TOKEN_SECRETKEY || "accesssecretkey";

const validateToken = (req, res, next) => {
  //get authorisation header value
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader === undefined) {
    res.sendStatus(403);
  } else {
    //token is of form 'bearer <tokenvalue>' so separate
    const token = bearerHeader.split(" ")[1];
    // returns userObject or false
    const userData = verifyToken(token)(ACCESS_TOKEN_SECRETKEY);
    if (!!userData) {
      req.user = userData;
      next();
    } else {
      res.sendStatus(403);
    }
  }
};

module.exports.validateToken = validateToken;
