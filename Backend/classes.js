const {
	v4: uuidv4
} = require("uuid");

module.exports.Post = class Post {
	//   text: string;
	//   author: string;
	//   date: number;
	//   id: string;
	// voters: string[];
	//score: number;

	constructor(text, author, location) {
		this.text = text;
		this.author = author;
		this.location = {
			latitude: location.latitude,
			longitude: location.longitude
		};
		this.date = new Date().getTime();
		this.id = `P${uuidv4()}`;
		this.downVoters = [];
		this.upVoters = [];
		this.score = 0;
	}

	voteUp(voterUsername) {
		if (this.upVoters.includes(voterUsername)) return null
		else {
			if (this.downVoters.includes(voterUsername)) {
				this.downVoters = this.downVoters.filter(voter => voter !== voterUsername)
				this.score++
			}
			this.upVoters.push(voterUsername)
			this.score++
			return this.score
		}
	}

	voteDown(voterUsername) {
		if (this.downVoters.includes(voterUsername)) return null
		else {
			if (this.upVoters.includes(voterUsername)) {
				this.upVoters = this.upVoters.filter(voter => voter !== voterUsername)
				this.score--
			}
			this.downVoters.push(voterUsername)
			this.score--
			return this.score
		}
	}

	withoutVoters() {
		return {
			text: this.text,
			author: this.author,
			location: this.location,
			date: this.date,
			id: this.id,
			score: this.score
		}
	}

};