const { verifyAccessToken } = require("../../jwt");
const { responseCreator } = require("../../utils");

const validateToken = (req, res, next) => {
  const response = responseCreator(res);
  const response403 = response(403);
  //get authorisation header value
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader === undefined) {
    return response403("failed to authenticate");
  } else {
    //token is of form 'bearer <tokenvalue>' so separate
    const token = bearerHeader.split(" ")[1];
    // returns userObject or false
    verifyAccessToken(token)((err, tokenData) => {
      if (err) return response403("failed to authenticate");
      req.user = tokenData;
      next();
    });
  }
};

module.exports.validateToken = validateToken;
