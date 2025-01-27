const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("../model/userModel");
const Blog = require("../model/blogModel");

// add blog by user

exports.addBlog = async (req, res) => {
  try {
    const { title, content, topic, visibility, imageUrl, userId, userName } =
      req.body;
    const newBlog = new Blog({
      title,
      content,
      topic,
      visibility,
      imageUrl,
      userId,
      userName,
    });
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

// displaying a specific blog

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
};

// displaying all the blogs of an specific user

exports.getAllBlogsByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const blogs = await Blog.find({ userId });

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found for this user" });
    }
    res.status(200).json({ message: "Blogs fetched successfully", blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Error fetching blogs" });
  }
};

// edit an specific blog

exports.editBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, content, topic, visibility, imageUrl } = req.body;

    // Validate input
    if (!title || !content || !topic) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedBlogData = {
      title,
      content,
      topic,
      visibility,
      imageUrl,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedBlogData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
      userId: updatedBlog.userId,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res
      .status(500)
      .json({ message: "Error updating blog", error: error.message });
  }
};

// delete an specific blog

exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res
      .status(200)
      .json({ message: "Blog deleted successfully", blog: deletedBlog });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Error deleting blog" });
  }
};

// find the blogs with the keyword

exports.findByWord = async (req, res) => {
  const { keyword } = req.params;  // Use req.params instead of req.query

  if (!keyword) {
    return res.status(400).json({ message: "Keyword is required for search." });
  }

  try {
    const blogs = await Blog.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
        { topic: { $regex: keyword, $options: "i" } },
      ],
    });

    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Error finding blogs:", error);
    res.status(500).json({ message: "An error occurred while searching for blogs." });
  }
};

