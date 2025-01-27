const express = require("express");
const blogController = require("../controller/blogController");
const userAuth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/addblog", userAuth.userAuth, blogController.addBlog);
router.get("/allblogs", blogController.allBlogs);
router.get("/specificblog/:id", blogController.specificBlog);
router.get("/allblogsbyuser/:id", blogController.getAllBlogsByUser);
router.put("/editblog/:id", userAuth.userAuth, blogController.editBlog);
router.delete("/deleteblog/:id", userAuth.userAuth, blogController.deleteBlog);
router.get('/search/:keyword', blogController.findByWord);

module.exports = router;