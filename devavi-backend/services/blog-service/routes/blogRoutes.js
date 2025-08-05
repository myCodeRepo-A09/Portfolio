const router = require("express").Router();
const {
  getBlogById,
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  commentBlog,
} = require("../controller/blogs.controller");

router.get("/getBlogById/:id", getBlogById);
router.get("/getAllBlogs", getAllBlogs);
router.post("/createBlog", createBlog);
router.post("/updateBlog/:id", updateBlog);
router.delete("/deleteBlog/:id", deleteBlog);
router.post("/:id/like", likeBlog);
router.post("/:id/comment", commentBlog);

module.exports = router;
