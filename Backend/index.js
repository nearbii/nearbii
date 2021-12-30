//CORE
const express = require("express"),
  jwt = require("jsonwebtoken"),
  bodyParser = require("body-parser"),
  { apiRoutes } = require("./apiRoutes.ts"),
  { Post } = require("./classes.js");
const app = express();
const cors = require("cors");
const { tokenCreater, verifyRefreshToken } = require("./jwt");
const {
  formatUser,
  insertUserIntoDb,
  getUserFromDb,
  insertRefreshToken,
  getRefreshTokenFromDb,
  deleteRefreshToken,
} = require("./user");
const { responseCreator } = require("./utils");
//CUSTOM
const { validateToken } = require("./Middleware/Authentication/index.ts");
const { encryptPassword, comparePasswords } = require("./utils");
const pipe = require("ramda/src/pipe");
const { isInRadius } = require("./backendUtils.js");
const { toDateFormat, getTodaysDate } = require("./date");

app.use(bodyParser.json());
app.use(cors());

const refreshTokens = [];

//TODO: move to env file

const ACCESS_TOKEN_SECRETKEY =
  process.env.ACCESS_TOKEN_SECRETKEY || "accesssecretkey";
const REFRESH_TOKEN_SECRETKEY =
  process.env.REFRESH_TOKEN_SECRETKEY || "refreshsecretkey";
const TOKENLENGTHSECONDS = process.env.TOKENLENGTHSECONDS || 15;
const DISTANCERADIUS = process.env.DISTANCERADIUS || 5;
const MAXLENGTH = process.env.POSTMAXLENGTH || 40;

//TODO: move to seperate files eg. auth, posts, etc etc

app.post(apiRoutes.register, async (req, res) => {
  const { username, password } = req.body;
  const response = responseCreator(res);
  const response409 = response(409);
  const response400 = response(400);
  const response200 = response(200);
  // check for existing user
  const existingUser = await getUserFromDb(username);
  if (existingUser) {
    response409(`User '${existingUser.username}' already exists!`);
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
    return response400("Failed to register user");
  }
});

app.post(apiRoutes.login, async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserFromDb(username);
  const response = responseCreator(res);
  const response403 = response(403);
  const response200 = response(200);
  if (!user) {
    // user does not exist
    return response403(`Could not authorise credentials.`);
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
    return response403(`Could not authorise credentials.`);
  }
});

app.post(apiRoutes.token, async (req, res) => {
  const response = responseCreator(res);
  const response401 = response(401);
  const response403 = response(403);
  const response200 = response(200);
  const { refreshToken } = req.body;
  //if the token wasnt sent, return 401
  if (!refreshToken)
    return response401("refresh token does not exist in request");
  //if the token doesnt exist in our store
  const token = await getRefreshTokenFromDb(refreshToken);
  // error if token does not exist in db
  if (!token) return response403("refresh token does not exist");
  // check expiry date is greater than today
  if (toDateFormat(token.expiry) < getTodaysDate()) {
    // delete token from db
    await deleteRefreshToken(token);
    // return 403 to user
    return response403("token has expired");
  }
  // verify token on success
  verifyRefreshToken(refreshToken)((err, tokenData) => {
    if (err) return res.sendStatus(403);
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

app.delete(apiRoutes.logout, async (req, res) => {
  const { token } = req.body;
  const response = responseCreator(res);
  const response204 = response(204);
  // remove token from db
  await deleteRefreshToken(token);
  response204("Succesfully logged out");
});

const posts = [];

//TODO: move the validate token to a different call prior to calling these endpoints

app.post(apiRoutes.post, validateToken, (req, res) => {
  if (req.body.text.length > MAXLENGTH) {
    res.status(413).json({
      message: `Post exceeds character limit of ${MAXLENGTH}!`,
    });
    return;
  }
  if (req.body.text.length === 0) {
    res.status(404).json({
      message: "Post cannot be empty!",
    });
    return;
  }
  const post = new Post(
    req.body.text,
    req.user.username,
    req.body.location.coords
  );
  posts.push(post);
  res.status(200).json({
    message: "Post created!",
  });
});

app.post(apiRoutes.getPosts, validateToken, (req, res) => {
  const { latitude, longitude } = req.body.location.coords;

  const postsInRadius = posts.filter((post) =>
    isInRadius(
      post.location,
      {
        latitude,
        longitude,
      },
      DISTANCERADIUS
    )
  );

  const postsWithHiddenVoters = postsInRadius.map((post) =>
    post.withoutVoters()
  );

  const sortedPosts = postsWithHiddenVoters.sort(
    (postA, postB) => postB.date - postA.date
  );

  res.status(200).json({
    message: `Successfully got ${posts.length} posts!`,
    posts: sortedPosts,
  });
});

app.post(apiRoutes.votePostUp, validateToken, (req, res) => {
  const postID = req.body.postID;
  const post = posts.find((post) => post.id === postID);

  if (!post) {
    //TODO: check http status code
    res.status(400).json({
      message: `Can't vote, post with ID ${post.id} couldn't be found!`,
      post: null,
    });
    return;
  }

  const vote = post.voteUp(req.user.username);

  if (vote === null) {
    //TODO: check http status code
    res.status(400).json({
      message: `Can't vote, ${
        post.author === req.user
          ? "you are the post author!"
          : "you have already voted!"
      }`,
      post: post.withoutVoters(),
    });
    return;
  }

  res.status(200).json({
    message: `Post votes increased to ${post.score}!`,
    post: post.withoutVoters(),
  });
});

app.post(apiRoutes.votePostDown, validateToken, (req, res) => {
  const postID = req.body.postID;
  const post = posts.find((post) => post.id === postID);

  if (!post) {
    //TODO: check http status code
    res.status(400).json({
      message: `Can't vote, post with ID ${post.id} couldn't be found!`,
      post: null,
    });
    return;
  }

  const vote = post.voteDown(req.user.username);

  if (vote === null) {
    //TODO: check http status code
    res.status(400).json({
      message: `Can't vote, ${
        post.author === req.user
          ? "you are the post author!"
          : "you have already voted!"
      }`,
      post: post.withoutVoters(),
    });
    return;
  }

  res.status(200).json({
    message: `Post votes decreased to ${post.score}!`,
    post: post.withoutVoters(),
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
