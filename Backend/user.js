const { pipe } = require("ramda");
const { PrismaClient } = require("@prisma/client");
const { use } = require("bcrypt/promises");
const prisma = new PrismaClient();

// user util functions

const returnClonedUser = (user) => {
  return { ...user };
};

const removeUserPassword = (user) => {
  if (user.password) delete user.password;
  return user;
};

const formatUser = pipe(returnClonedUser, removeUserPassword);

// DB functions

const insertUserIntoDb = async (user) => {
  // insert user into the database
  return prisma.user.create({
    data: user,
  });
};

const getUserFromDb = async (username) => {
  // get user with username (email)
  return prisma.user.findUnique({
    where: {
      username: username,
    },
  });
};

module.exports = {
  returnClonedUser,
  removeUserPassword,
  formatUser,
  insertUserIntoDb,
  getUserFromDb,
};
