const express = require("express"),
	jwt = require("jsonwebtoken"),
	bodyParser = require("body-parser"),
	{
		apiRoutes
	} = require("./apiRoutes.ts"),
	{
		Post
	} = require('./classes.js');

const app = express();
var cors = require('cors')
app.use(bodyParser.json());
app.use(cors());

const users = [{
	username: "q",
	password: "q"
}];

//TODO: move to env file
const ACCESS_TOKEN_SECRETKEY = process.env.ACCESS_TOKEN_SECRETKEY || 'accesssecretkey';
const REFRESH_TOKEN_SECRETKEY = process.env.REFRESH_TOKEN_SECRETKEY || 'refreshsecretkey';
const TOKENLENGTHMINS = process.env.TOKENLENGTHMINS || 30;

//TODO: use arrow functions for callbacks
app.post(apiRoutes.register, function (req, res) {
	const existingUser = users.find(user => user.username === req.body.username);

	if (existingUser) {
		res.status(409).json({
			message: `User '${existingUser.username}' already exists!`
		})
	} else {
		const newUser = {
			username: req.body.username,
			password: req.body.password
		}
		users.push(newUser)
		res.status(200).json({
			message: `Successfully registered '${req.body.username}'!`,
			user: newUser
		})
	}
})

app.post(apiRoutes.login, function (req, res) {

	//TODO: authenticate user properly!
	const user = users.find(user => user.username === req.body.username && user.password === req.body.password);
	if (user) {
		const accessToken = generateAccessToken(user)
		const refreshToken = jwt.sign({
			user
		}, REFRESH_TOKEN_SECRETKEY)
		refreshTokens.push(refreshToken);
		res.status(200).json({
			message: `Successfuly logged '${user.username}' in!`,
			accessToken,
			refreshToken
		})
	} else {
		res.status(403).json({
			message: `Could not authorise credentials.`
		})
	}

});

app.delete(apiRoutes.logout, function (req, res) {
	//TODO: database it up
	refreshTokens = refreshTokens.filter(token => token !== req.body.token);
	res.sendStatus(204)
})

const posts = [];

app.post(apiRoutes.post, validateToken, function (req, res) {
	const post = new Post(req.body.text, req.user.username);
	posts.push(post);
	console.log(posts);
	res.status(200).json({
		message: 'Post created!'
	});
});

const refreshTokens = [];

app.post(apiRoutes.token, function (req, res) {
	//TODO: use database
	const refreshToken = req.body.refreshToken;
	//if the token wasnt sent, return 401
	if (!refreshToken) return res.sendStatus(401);
	//if the token doesnt exist in our store
	if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
	jwt.verify(refreshToken, REFRESH_TOKEN_SECRETKEY, (err, tokenData) => {
		if (err) return res.sendStatus(403);
		const accessToken = generateAccessToken(tokenData);
		res.status(200).json({
			accessToken
		});
	})
})

function validateToken(req, res, next) {
	//get authorisation header value
	const bearerHeader = req.headers["authorization"];
	if (bearerHeader === undefined) {
		res.sendStatus(403);
	} else {
		//token is of form 'bearer <tokenvalue>' so separate
		const token = bearerHeader.split(' ')[1];
		jwt.verify(token, ACCESS_TOKEN_SECRETKEY, (err, tokenData) => {
			req.user = tokenData.user;
			err ? res.sendStatus(403) : next();
		})
	}
}

function generateAccessToken(user) {
	if (user.password) delete user.password;
	return jwt.sign({
		user
	}, ACCESS_TOKEN_SECRETKEY, {
		expiresIn: `${TOKENLENGTHMINS}m`
	})
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));