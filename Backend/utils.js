const bcrypt = require("bcrypt");
const saltRounds = 10;

// encrypt password helpers - could be moved to a seperate file outside of utils

const encryptPassword = async (password) => bcrypt.hash(password, saltRounds);

module.exports = {
  encryptPassword,
};
