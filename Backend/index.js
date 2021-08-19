const express = require("express"),
	jwt = require('jsonwebtoken'),
	bodyParser = require("body-parser"),
	{
		apiRoutes
	} = require("./apiRoutes.ts");

const app = express();

app.use(bodyParser.json());

const users = [];

const SECRETKEY = process.env.SECRETKEY || 'secretkey';
const TOKENLENGTHSECONDS = process.env.TOKENLENGTHSECONDS || 30;

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
	user ? jwt.sign({
		user
	}, SECRETKEY, {
		expiresIn: `${TOKENLENGTHSECONDS}s`
	}, (err, token) => {
		res.status(200).json({
			message: `Successfuly logged '${user.username}' in!`,
			token
		})
	}) : res.status(403).json({
		message: `Could not authorise credentials.`
	})
});

app.post(apiRoutes.post, validateToken, function (req, res) {
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
		jwt.verify(token, SECRETKEY, (err, tokenData) => {
			console.log(tokenData)
			err ? res.sendStatus(403) : next();
		})
	}
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));