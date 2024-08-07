const express = require("express");
const postController = require("../controllers/post");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

const router = express.Router();

router.post("/addPost", verify, postController.addPost);

router.patch("/updatePost/:postId", verify, postController.updatePost);

router.delete("/deleteMyPost/:postId", verify, postController.deleteMyPost);

router.get("/getPosts", postController.getPosts);

router.get("/getPost/:postId", postController.getPost);

router.patch("/addComment/:postId", verify, postController.addComment);

router.get("/getComments/:postId", postController.getComments);

router.delete("/deleteAllPost", verify, verifyAdmin, postController.deletePost);

router.delete("/deleteComment/:postId", verify, verifyAdmin, postController.deleteComment);

module.exports = router;