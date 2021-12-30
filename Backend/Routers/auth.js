const { tokenCreater, verifyRefreshToken } = require("../jwt");
const {
  apiRoutes: { logout, login, register, token },
} = require("../apiRoutes.ts");
const {
  formatUser,
  insertUserIntoDb,
  getUserFromDb,
  insertRefreshToken,
  getRefreshTokenFromDb,
  deleteRefreshToken,
} = require("../user");
const { responseCreator } = require("../utils");
//CUSTOM
const { encryptPassword, comparePasswords } = require("../utils");
const pipe = require("ramda/src/pipe");
const { toDateFormat, getTodaysDate } = require("../date");
const express = require("express");
const router = express.Router();

const ACCESS_TOKEN_SECRETKEY =
  process.env.ACCESS_TOKEN_SECRETKEY || "accesssecretkey";
const REFRESH_TOKEN_SECRETKEY =
  process.env.REFRESH_TOKEN_SECRETKEY || "refreshsecretkey";
const TOKENLENGTHSECONDS = process.env.TOKENLENGTHSECONDS || 15;

router.post(register, async (req, res) => {
  const { username, password } = req.body;
  const response = responseCreator(res);
  const response409 = response(409);
  const response400 = response(400);
  const response200 = response(200);
  // check for existing user
  const existingUser = await getUserFromDb(username);
  if (existingUser) {
    response409({ message: `User '${existingUser.username}' already exists!` });
  }
  // add user to the db and return success
  const encryptedPassword = await encryptPassword(password);
  const user = await insertUserIntoDb({
    username,
    password: encryptedPassword,
  });

  if (!!user) {
    return response200({
      message: `Successfully registered '${req.body.username}'!`,
      user: formatUser(user),
    });
  } else {
    // Failed to add user to the db
    return response400({ message: "Failed to register user" });
  }
});

router.post(login, async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserFromDb(username);
  const response = responseCreator(res);
  const response403 = response(403);
  const response200 = response(200);
  if (!user) {
    // user does not exist
    return response403({ message: `Could not authorise credentials` });
  }
  // check password and username
  const { password: hash, username: dbUsername } = user;
  const passwordMatch = await comparePasswords(hash, password);
  const usernameMatch = dbUsername === username;

  if (passwordMatch && usernameMatch) {
    // get tokens
    const formattedToken = pipe(formatUser, tokenCreater)(user);
    const accessToken = formattedToken(ACCESS_TOKEN_SECRETKEY)(
      TOKENLENGTHSECONDS
    );
    const refreshToken = formattedToken(REFRESH_TOKEN_SECRETKEY)(60000);
    // expires today + 15 seconds
    const expiresAt = getTodaysDate().getTime() + 15000;
    // insert refresh token into db
    await insertRefreshToken(refreshToken);
    return response200({
      message: `Successfuly logged '${user.username}' in!`,
      accessToken,
      refreshToken,
      expiresAt,
    });
  } else {
    // password does not match
    return response403({ message: `Could not authorise credentials.` });
  }
});

router.post(token, async (req, res) => {
  const response = responseCreator(res);
  const response401 = response(401);
  const response403 = response(403);
  const response200 = response(200);
  const { refreshToken } = req.body;
  //if the token wasnt sent, return 401
  if (!refreshToken)
    return response401({ message: "refresh token does not exist in request" });
  //if the token doesnt exist in our store
  const token = await getRefreshTokenFromDb(refreshToken);
  // error if token does not exist in db
  if (!token) return response403({ message: "refresh token does not exist" });
  // check expiry date is greater than today
  if (toDateFormat(token.expiry) < getTodaysDate()) {
    // delete token from db
    await deleteRefreshToken(token);
    // return 403 to user
    return response403({ message: "token has expired" });
  }
  // verify token on success
  verifyRefreshToken(refreshToken)((err, tokenData) => {
    if (err) return response403();
    const formattedToken = pipe(formatUser, tokenCreater)(tokenData);
    const accessToken = formattedToken(ACCESS_TOKEN_SECRETKEY)(
      TOKENLENGTHSECONDS
    );
    // set token expiry current day and time + 15 seconds
    const expiresAt = getTodaysDate().getTime() + 15000;
    return response200({
      accessToken,
      expiresAt,
    });
  });
});

router.delete(logout, async (req, res) => {
  const { token } = req.body;
  const response = responseCreator(res);
  const response204 = response(204);
  // remove token from db
  await deleteRefreshToken(token);
  response204({ message: "Succesfully logged out" });
});

module.exports = router;
