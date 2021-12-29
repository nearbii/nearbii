const { pipe } = require("ramda");

const returnClonedUser = (user) => {
  return { ...user };
};

const removeUserPassword = (user) => {
  if (user.password) delete user.password;
  return user;
};

const formatUser = pipe(returnClonedUser, removeUserPassword);

module.exports = {
  returnClonedUser,
  removeUserPassword,
  formatUser,
};
