const express = require("express"),
	jwt = require('jsonwebtoken'),
	bodyParser = require("body-parser"),
	{
		apiRoutes
	} = require("./apiRoutes.ts");

const app = express();

app.use(bodyParser.json());

const users = [{
	username: 'q',
	password: 'q'
}];

//TODO: move to env file
const ACCESS_TOKEN_SECRETKEY = process.env.ACCESS_TOKEN_SECRETKEY || 'accesssecretkey';
const REFRESH_TOKEN_SECRETKEY = process.env.REFRESH_TOKEN_SECRETKEY || 'refreshsecretkey';
const TOKENLENGTHMINS = process.env.TOKENLENGTHMINS || 30;

//TODO: use arrow functions for callbacks
app.post(apiRoutes.register, function (req, res) {
	const existingUser = users.find(user => user.username === req.body.username);

	if (existingUser) {
		res.status(400).json({
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

app.post(apiRoutes.post, validateToken, function (req, res) {
	console.log('post created!!')
	res.status(200).json({
		message: 'Post created!'
	});
});

function validateToken(req, res, next) {
	//get authorisation header value
	const bearerHeader = req.headers["authorization"];
	if (bearerHeader === undefined) {
		res.sendStatus(403);
	} else {
		//token is of form 'bearer <tokenvalue>' so separate
		const token = bearerHeader.split(' ')[1];
		jwt.verify(token, ACCESS_TOKEN_SECRETKEY, (err, tokenData) => {
			console.log(tokenData)
			err ? res.sendStatus(403) : next();
		})
	}
}

function generateAccessToken(user) {
	return jwt.sign({
		user
	}, ACCESS_TOKEN_SECRETKEY, {
		expiresIn: `${TOKENLENGTHMINS}m`
	})
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));