const Blog = require("../models/blog.model");
const Project = require("../models/project.model");
const News = require("../models/news.model");
const Learn = require("../models/learn.model");

exports.getDashboardSummary = async (req, res) => {
  try {
    const [latestBlogs, latestProjects, latestNews, latestLearns] =
      await Promise.all([
        Blog.find({ status: "published" })
          .sort({ published_at: -1 })
          .limit(3)
          .lean(),
        Project.find().sort({ createdAt: -1 }).limit(3).lean(),
        News.find().sort({ newsdatetime: -1 }).limit(3).lean(),
        Learn.find().sort({ createdAt: -1 }).limit(4).lean(),
      ]);

    res.json({
      blogs: latestBlogs,
      projects: latestProjects,
      news: latestNews,
      learn: latestLearns,
    });
  } catch (err) {
    console.error("Dashboard Fetch Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
