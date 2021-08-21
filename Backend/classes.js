const {
	v4: uuidv4
} = require("uuid");

module.exports.Post = class Post {
	//   text: string;
	//   author: string;
	//   date: number;
	//   id: string;

	constructor(text, author, date = new Date().getTime(), id = "P" + uuidv4()) {
		this.text = text;
		this.author = author;
		this.date = date;
		this.id = id;
	}
};