const express = require("express");
const userController = require("../controller/userController");
const userAuth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;