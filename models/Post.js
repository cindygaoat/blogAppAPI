const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Title is Required']
	},
	content: {
		type: String,
		required: [true, 'Content is Required']
	},
	author: {
		type: String,
		required: [true, 'Author is Required']
	},
	dateCreated: {
		type: Date,
		default: Date.now
	},
	comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
				ref: "User",
                required: [true]
            },
            comment: {
                type: String,
                required: [true, 'Comment is Required']
            }
        }
    ]
});


module.exports = mongoose.model('Post', postSchema);