const Blog = require("../models/blog.model");
const Project = require("../models/project.model");
const News = require("../models/news.model");
const Learn = require("../models/learn.model");
const logger = require("../logger/logger");
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
