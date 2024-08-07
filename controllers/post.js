const Post = require("../models/Post");
const auth = require("../auth");

module.exports.addPost = (req, res) => {

	let newPost = new Post({
		title: req.body.title,
		content: req.body.content,
		author : req.user.username
	});

	    return newPost.save()
	    .then(post => res.status(201).send(post))
	    .catch(saveErr => {
	        console.error("Error in adding post: ", saveErr)

	        return res.status(500).send({ error: 'Failed to add post' });
	    });

};

module.exports.updatePost = (req, res) => {
	return Post.findByIdAndUpdate( { _id: req.params.postId }, 
		{
			title: req.body.title,
			content: req.body.content
		}, 
		{ new: true } 
	)
	.then((updatedPost) => {
		if(updatedPost) {
			return res.status(200).send({ message: "Post updated successfully", updatedPost: updatedPost});
		} else {
			return res.status(404).send({ message: "Post not found"});
		}
	})
	.catch((error) => {
		console.error("Error in updating post: ", err)
		return res.status(500).send({ error: 'Error in updating post.' });
	});
}

module.exports.deleteMyPost = (req, res) => {

    return Post.findByIdAndDelete(req.params.postId)
    .then(deletedPost => {
        if (!deletedPost) {
            return res.status(404).send({ error: 'Post not deleted' });
        }

        return res.status(200).send({message: 'Post deleted successfully'});

    })
    .catch(err => {
		console.error("Error in deleting a post: ", err)
		return res.status(500).send({ error: 'Error in deleting a post.' });
	});
};

module.exports.getPosts = (req, res) => {

	return Post.find({}).then(posts => {
		return res.status(200).send({ posts });
	}).catch(findErr => {
	    console.error("Error in finding posts: ", findErr)

	    return res.status(500).send({ message:'Error finding posts' });
	});
}; 


module.exports.getPost = (req, res) => {

	return Post.findById(req.params.postId).then(post => {
		return res.status(200).send(post);
	}).catch(findErr => {
	    console.error("Error in finding post: ", findErr)

	    return res.status(500).send({ message:'Error finding post' });
	});
}; 

module.exports.addComment = (req, res) => {

	if(req.user.isAdmin){
    	return res.send("Admin not allowed to add comment")
  	}

	return Post.findById(req.params.postId).then(post => {

    	let userComment = {
    		userId: req.user.id,
        	comment: req.body.comment
    	}

	    post.comments.push(userComment);
	    
	    return post.save()
	    .then(updatedPost => {
	        if (!updatedPost) {
	            return res.status(404).send({ error: 'Post not found' });
	        }

	        return res.status(200).send({ 
	        	message: 'comment added successfully', 
	        	updatedPost: updatedPost 
	        });

	    })
	    .catch(err => {
			console.error("Error in adding a comment: ", err)
			return res.status(500).send({ error: 'Error in adding a comment.' });
		});
	})
};

module.exports.getComments = (req, res) => {

	return Post.findById(req.params.postId).then(post => {

		return res.status(200).send({ comments: post.comments });
	})
};

module.exports.deletePost = (req, res) => {

    return Post.deleteMany({})
    .then(deletedPost => {
        if (!deletedPost) {
            return res.status(404).send({ error: 'Post not deleted' });
        }

        return res.status(200).send({message: 'All post deleted successfully'});

    })
    .catch(err => {
		console.error("Error in deleting all post: ", err)
		return res.status(500).send({ error: 'Error in deleting all post.' });
	});
};

module.exports.deleteComment = async (req, res) => {
	try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        post.comments = [];
        await post.save();
        res.json({ message: 'All comments deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete comments' });
    }
    // const postId = req.params.postId; // Extract postId and commentId from request parameters
    // const { commentId } = req.body;
    // console.log(commentId);

    // Post.findByIdAndUpdate(
    //     postId,
    //     { $pull: { comments: { _id: commentId } } },
    //     { new: true } // Return the updated document
    // )
    // .then(updatedPost => {
    //     if (!updatedPost) {
    //         return res.status(404).send({ error: 'Post not found' });
    //     }

    //     // Return the updated post or a success message
    //     return res.status(200).send({
    //         message: 'Comment deleted successfully',
    //         updatedPost
    //     });
    // })
    // .catch(err => {
    //     console.error('Error in deleting comment:', err);
    //     return res.status(500).send({ error: 'Error deleting comment' });
    // });
};