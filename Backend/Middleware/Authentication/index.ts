const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRETKEY = process.env.ACCESS_TOKEN_SECRETKEY || 'accesssecretkey';

const validateToken = (req, res, next) => {
	//get authorisation header value
	const bearerHeader = req.headers["authorization"];
	if (bearerHeader === undefined) {
		res.sendStatus(403);
	} else {
		//token is of form 'bearer <tokenvalue>' so separate
		const token = bearerHeader.split(' ')[1];

		jwt.verify(token, ACCESS_TOKEN_SECRETKEY, (err, tokenData) => {
			if (err) {
				res.sendStatus(403)
			} else {
				req.user = tokenData.user;
				next();
			}
		})
	}
}

module.exports.validateToken = validateToken;