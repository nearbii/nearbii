const bcrypt = require("bcrypt");
const saltRounds = 10;

// encrypt password helpers - could be moved to a seperate file outside of utils

const encryptPassword = (password) => bcrypt.hash(password, saltRounds);

const comparePasswords = (hash, password) => bcrypt.compare(password, hash);

// response utils

const errorResponseCreator = (res) => (errorCode) => (message) => {
  return res.status(errorCode).json({
    message,
  });
};

module.exports = {
  encryptPassword,
  comparePasswords,
  errorResponseCreator,
};
