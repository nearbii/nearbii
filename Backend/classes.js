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

	constructor(text, author) {
		this.text = text;
		this.author = author;
		this.date = new Date().getTime();
		this.id = `P${uuidv4()}`
		this.voters = [];
		this.score = 0;
	}

	voteUp(voterUsername) {
		if (this.author === voterUsername || this.voters.includes(voterUsername)) return null
		else {
			this.voters.push(voterUsername)
			this.score++
			return this.score
		}
	}

	voteDown(voterUsername) {
		if (this.author === voterUsername || this.voters.includes(voterUsername)) return null
		else {
			this.voters.push(voterUsername)
			this.score--
			return this.score
		}
	}

};