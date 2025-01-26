const express = require("express");
const userController = require("../controller/userController");
const userAuth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/addblog", userAuth.userAuth, userController.addBlog);
router.get("/allblogs", userController.allBlogs);

module.exports = router;