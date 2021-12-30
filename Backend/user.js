const { pipe } = require("ramda");
const { PrismaClient } = require("@prisma/client");
const { add5daysToDate } = require("./date");
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

const insertRefreshToken = async (token) => {
  // TODO: move util
  return prisma.refreshToken.create({
    data: {
      token,
      expiry: add5daysToDate(new Date()),
    },
  });
};

const getRefreshTokenFromDb = async (token) => {
  // get token
  return prisma.refreshToken.findUnique({
    where: {
      token: token,
    },
  });
};

const deleteRefreshToken = async (token) => {
  // delete token
  return prisma.refreshToken.delete({
    where: {
      token: token,
    },
  });
};

module.exports = {
  returnClonedUser,
  removeUserPassword,
  formatUser,
  insertUserIntoDb,
  getUserFromDb,
  insertRefreshToken,
  getRefreshTokenFromDb,
  deleteRefreshToken,
};
