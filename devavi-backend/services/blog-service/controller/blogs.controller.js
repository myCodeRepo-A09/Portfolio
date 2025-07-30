const blogModel = require("../models/blog.model");
const redis = require("../../../shared/redis/redisClient");
exports.getBlogById = async function (req, res) {
  const blogId = req.params.id;
  try {
    if (!blogId) {
      res.status(400).json({
        success: false,
        message: "Blog Id is not valid",
      });
    }
    const blog = await blogModel.findOne({ _id: blogId });
    if (!blog) {
      res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    // blog.views.user.push("userIdFromAuth");
    // blog.views.count = (blog.likes.count || 0) + 1;
    // await blog.save();
    res.status(200).json({
      success: true,
      data: blog,
      message: "Blog Data Received Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to open blog",
      error,
    });
  }
};
exports.getAllBlogs = async function (req, res) {};
exports.createBlog = async function (req, res) {
  try {
    const blogData = req.body;

    const blog = new blogModel({
      title: blogData.title,
      readTime: blogData.readTime,
      images: blogData.images,
      videoPaths: blogData.videoPaths,
      content: blogData.content,
      excerpt: blogData.excerpt,
      slug: blogData.slug,
      author_id: blogData.author_id,
      tags: blogData.tags,
      status: blogData.status,
      published_at: blogData.published_at,
    });

    const savedBlog = await blog.save();
    if (await redis.get("dashboardSummary")) {
      await redis.del("dashboardSummary");
    }

    res.status(201).json({ success: true, data: savedBlog });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create blog", error });
  }
};
exports.updateBlog = async function (req, res) {};
exports.deleteBlog = async function (req, res) {};
exports.likeBlog = async function (req, res) {
  try {
    const blog = await blogModel.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const userId = req.body.user || "default-user"; // Replace with actual auth extraction

    // Prevent double-like
    if (!blog.likes.user.includes(userId)) {
      blog.likes.user.push(userId);
      blog.likes.count += 1;
    }

    await blog.save();

    if (await redis.get("dashboardSummary")) {
      await redis.del("dashboardSummary");
    }

    res.json(blog);
  } catch (error) {
    console.error("Error in likeBlog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.commentBlog = async function (req, res) {
  try {
    const { user, comment } = req.body;
    console.log(user, comment);

    if (!user || !comment) {
      return res.status(400).json({ message: "User and comment are required" });
    }

    const blog = await blogModel.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.comments.push({
      user,
      text: comment,
    });

    await blog.save();

    if (await redis.get("dashboardSummary")) {
      await redis.del("dashboardSummary");
    }

    res.json(blog);
  } catch (error) {
    console.error("Error in commentBlog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
