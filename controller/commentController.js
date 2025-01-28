const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("../model/userModel");
const Blog = require("../model/blogModel");