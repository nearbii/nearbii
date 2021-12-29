const { verifyAccessToken } = require("../../jwt");

const validateToken = (req, res, next) => {
  //get authorisation header value
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader === undefined) {
    res.sendStatus(403);
  } else {
    //token is of form 'bearer <tokenvalue>' so separate
    const token = bearerHeader.split(" ")[1];
    // returns userObject or false
    const userData = verifyAccessToken(token);
    if (!!userData) {
      req.user = userData;
      next();
    } else {
      res.sendStatus(403);
    }
  }
};

module.exports.validateToken = validateToken;
