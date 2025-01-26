const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("../model/userModel");
const Blog = require("../model/blogModel");
const ImageKit = require("imagekit");

// ImageKit instance for generating authentication parameters
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// user signup

exports.register = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, name, password: hashedPassword });
    await newUser.save();

    const payload = {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
    };
    const token = jwt.sign(payload, process.env.USER_JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ message: "Account created successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during registration" });
  }
};

// user login

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const payload = { id: user._id, email: user.email, name: user.name };
    const token = jwt.sign(payload, process.env.USER_JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during login" });
  }
};

// add blog by user

exports.addBlog = async (req, res) => {
  try {
    const { title, content, topic, visibility, imageUrl, userId, userName } = req.body;
    const newBlog = new Blog({ title, content, topic, visibility, imageUrl, userId, userName });
    await newBlog.save();

    res.status(201).json({ message: "Blog saved successfully", blog: newBlog });
  } catch (error) {
    console.error("Error saving blog:", error);
    res.status(500).json({ error: "Error saving blog" });
  }
};

// display all the blogs inside the database

exports.allBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    
    if (blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found" });
    }

    res.status(200).json({ message: "All blogs fetched successfully", blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Error fetching blogs" });
  }
};


exports.specificBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog fetched successfully", blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Error fetching blog" });
  }
}