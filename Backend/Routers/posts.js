const express = require("express");
const { Post } = require("../classes.js");
const router = express.Router();
const DISTANCERADIUS = process.env.DISTANCERADIUS || 5;
const MAXLENGTH = process.env.POSTMAXLENGTH || 40;
const { isInRadius } = require("../backendUtils.js");
const {
  apiRoutes: { post, getPosts, votePostDown, votePostUp },
} = require("../apiRoutes.ts");

const posts = [];

router.post(post, (req, res) => {
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

router.post(getPosts, (req, res) => {
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

router.post(votePostUp, (req, res) => {
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

router.post(votePostDown, (req, res) => {
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

module.exports = router;
