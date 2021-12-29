//CORE
const express = require("express"),
  jwt = require("jsonwebtoken"),
  bodyParser = require("body-parser"),
  { apiRoutes } = require("./apiRoutes.ts"),
  { Post } = require("./classes.js");
const app = express();
const cors = require("cors");
const { tokenCreater, verifyAccessToken } = require("./jwt");
const { formatUser } = require("./user");
//CUSTOM
const { validateToken } = require("./Middleware/Authentication/index.ts");
const pipe = require("ramda/src/pipe");
app.use(bodyParser.json());
app.use(cors());

const users = [
  {
    username: "q",
    password: "q",
  },
];

//TODO: move to env file
const ACCESS_TOKEN_SECRETKEY =
  process.env.ACCESS_TOKEN_SECRETKEY || "accesssecretkey";
const REFRESH_TOKEN_SECRETKEY =
  process.env.REFRESH_TOKEN_SECRETKEY || "refreshsecretkey";
const TOKENLENGTHSECONDS = process.env.TOKENLENGTHSECONDS || 15;

//TODO: use arrow functions for callbacks
app.post(apiRoutes.register, function (req, res) {
  const existingUser = users.find(
    (user) => user.username === req.body.username
  );
  if (existingUser) {
    res.status(409).json({
      message: `User '${existingUser.username}' already exists!`,
    });
  } else {
    const newUser = {
      username: req.body.username,
      password: req.body.password,
    };
    users.push(newUser);
    res.status(200).json({
      message: `Successfully registered '${req.body.username}'!`,
      user: newUser,
    });
  }
});

app.post(apiRoutes.login, (req, res) => {
  //TODO: authenticate user properly!
  const user = users.find(
    (user) =>
      user.username === req.body.username && user.password === req.body.password
  );
  if (user) {
    // get tokens
    const formattedToken = pipe(formatUser, tokenCreater)(user);
    const accessToken = formattedToken(ACCESS_TOKEN_SECRETKEY)(
      TOKENLENGTHSECONDS
    );
    const refreshToken = formattedToken(REFRESH_TOKEN_SECRETKEY)(6000);
    // get expiry
    const expiresAt = verifyAccessToken(accessToken).exp * 1000;
    // TODO: remove to real db
    refreshTokens.push(refreshToken);
    // response
    res.status(200).json({
      message: `Successfuly logged '${user.username}' in!`,
      accessToken,
      refreshToken,
      expiresAt,
    });
  } else {
    res.status(403).json({
      message: `Could not authorise credentials.`,
    });
  }
});

app.delete(apiRoutes.logout, function (req, res) {
  //TODO: database it up
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

const posts = [];

app.post(apiRoutes.post, validateToken, function (req, res) {
  const post = new Post(req.body.text, req.user.username);
  posts.push(post);
  res.status(200).json({
    message: "Post created!",
  });
});

const refreshTokens = [];

app.post(apiRoutes.token, function (req, res) {
  //TODO: use database
  const refreshToken = req.body.refreshToken;
  //if the token wasnt sent, return 401
  if (!refreshToken) return res.sendStatus(401);
  //if the token doesnt exist in our store
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRETKEY, (err, tokenData) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken(tokenData);
    const expiresAt =
      jwt.verify(accessToken, ACCESS_TOKEN_SECRETKEY).exp * 1000;
    res.status(200).json({
      accessToken,
      expiresAt,
    });
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
