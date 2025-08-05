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
exports.getAllBlogs = async function (req, res) {
  try {
    const blogs = await blogModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: blogs,
      message: "Blogs fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error,
    });
  }
};
exports.createBlog = async function (req, res) {
  try {
    const blogData = req.body;
    const contentSize = Buffer.byteLength(blogData.content || "", "utf-8");

    const MAX_CONTENT_SIZE = 17_825_792; // 17 MB (same as the error threshold)

    if (contentSize > MAX_CONTENT_SIZE) {
      return res.status(400).json({
        error: "Blog content is too large. Max allowed size is 17MB.",
      });
    }
    blog = new blogModel({
      title: blogData.title,
      readTime: blogData.readTime,
      images: blogData.images,
      videoPaths: blogData.videoPaths,
      content: blogData.content,
      excerpt: blogData.excerpt,
      slug: blogData.slug,
      author_id: blogData.author_id ? blogData.author_id : "Anonymous", // Replace with actual auth extraction
      tags: blogData.tags,
      status: blogData.status,
      published_at: blogData.published_at
        ? blogData.published_at
        : new Date().toISOString(),
      attachments: blogData.attachments,
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
exports.updateBlog = async function (req, res) {
  try {
    const blogId = req.params.id;
    const blogData = req.body;
    const contentSize = Buffer.byteLength(blogData.content || "", "utf-8");
    const MAX_CONTENT_SIZE = 17_825_792; // 17 MB (same as the error threshold)
    if (contentSize > MAX_CONTENT_SIZE) {
      return res.status(400).json({
        error: "Blog content is too large. Max allowed size is 17MB.",
      });
    }
    const updatedBlog = await blogModel.findByIdAndUpdate(
      blogId,
      {
        title: blogData.title,
        readTime: blogData.readTime,
        images: blogData.images,
        videoPaths: blogData.videoPaths,
        content: blogData.content,
        excerpt: blogData.excerpt,
        slug: blogData.slug,
        author_id: blogData.author_id ? blogData.author_id : "Anonymous", // Replace with actual auth extraction
        tags: blogData.tags,
        status: blogData.status,
        published_at: blogData.published_at
          ? blogData.published_at
          : new Date().toISOString(),
        attachments: blogData.attachments,
      },
      { new: true }
    );
    if (!updatedBlog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    if (await redis.get("dashboardSummary")) {
      await redis.del("dashboardSummary");
    }
    res.status(200).json({ success: true, data: updatedBlog });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update blog", error });
  }
};
exports.deleteBlog = async function (req, res) {
  try {
    const blogId = req.params.id;
    const deletedBlog = await blogModel.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    if (await redis.get("dashboardSummary")) {
      await redis.del("dashboardSummary");
    }
    res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete blog", error });
  }
};
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
