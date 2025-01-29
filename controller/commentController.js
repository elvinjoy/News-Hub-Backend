const Comment = require("../model/commentModel");

// Add a comment

exports.addComment = async (req, res) => {
  try {
    const { blogId, text, userId, userName } = req.body;

    if (!blogId || !text || !userId || !userName) {
      return res.status(400).json({
        success: false,
        message: "you should login to send comments",
      });
    }

    const newComment = new Comment({
      blogId,
      userId,
      userName,
      text: text.trim(),
    });

    await newComment.save();

    res.status(201).json({
      success: true,
      comment: {
        _id: newComment._id,
        blogId: newComment.blogId,
        userId: newComment.userId,
        userName: newComment.userName,
        text: newComment.text,
        createdAt: newComment.createdAt,
        updatedAt: newComment.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all comments for a specific blog post

exports.getCommentsByBlogId = async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!blogId) {
      return res
        .status(400)
        .json({ success: false, message: "Blog ID is required" });
    }

    const comments = await Comment.find({ blogId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
