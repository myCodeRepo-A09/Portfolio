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
    blog.views.user.push("userIdFromAuth");
    blog.views.count = (blog.likes.count || 0) + 1;
    await blog.save();
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
  const blog = await blogModel.findById(req.params.id);
  blog.likes.user.push("userIdFromAuth");
  blog.likes.count = (blog.likes.count || 0) + 1;
  await blog.save();
  if (await redis.get("dashboardSummary")) {
    await redis.del("dashboardSummary");
  }
  res.json(blog);
};
exports.commentBlog = async function (req, res) {
  const blog = await blogModel.findById(req.params.id);
  blog.comments.push({ user: "userIdFromAuth", text: req.body.comment });
  await blog.save();
  if (await redis.get("dashboardSummary")) {
    await redis.del("dashboardSummary");
  }
  res.json(blog);
};
