const Blog = require("../models/blog.model");
const Project = require("../models/project.model");
const News = require("../models/news.model");
const Learn = require("../models/learn.model");
const logger = require("../logger/logger");
const User = require("../models/user.model");
const redis = require("../../../shared/redis/redisClient");
exports.getDashboardSummary = async (req, res) => {
  try {
    logger.info("getDashboardSummary controller:request received");
    //await redis.del("dashboardSummary");
    const cached = await redis.get("dashboardSummary");
    if (cached) return res.json(JSON.parse(cached));
    else {
      console.log("non catched");
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
      await redis.set(
        "dashboardSummary",
        JSON.stringify({
          blogs: latestBlogs,
          projects: latestProjects,
          news: latestNews,
          learn: latestLearns,
        }),
        "EX",
        3600
      );
      res.status(200).json({
        blogs: latestBlogs,
        projects: latestProjects,
        news: latestNews,
        learn: latestLearns,
      });
    }
  } catch (err) {
    logger.error("Dashboard Fetch Error:", err);
    console.error("Dashboard Fetch Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.searchDashboard = async (req, res) => {
  const q = req.query.q;

  try {
    const blogs = await Blog.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: q,
            path: ["title", "description", "author_id"],
          },
        },
      },
      { $project: { _id: 1, type: "blog", title: 1, description: 1 } },
    ]);

    const users = await User.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: q,
            path: ["name", "email"],
          },
        },
      },
      { $project: { _id: 1, type: "user", name: 1, bio: 1 } },
    ]);

    const topics = await Learn.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: q,
            path: ["title"],
          },
        },
      },
      { $project: { _id: 1, type: "topic", title: 1, summary: 1 } },
    ]);

    const result = [...blogs, ...users, ...topics];
    res.json(result);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).send("Search failed");
  }
};
