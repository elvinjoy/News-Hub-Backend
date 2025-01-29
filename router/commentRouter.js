const express = require("express");
const router = express.Router();
const commentController = require("../controller/commentController");
const userAuth = require("../middleware/authMiddleware");

router.post("/addcomment", userAuth.userAuth, commentController.addComment);
router.get("/getcomments/:blogId", commentController.getCommentsByBlogId);

module.exports = router;