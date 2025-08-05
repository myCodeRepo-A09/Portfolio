const router = require("express").Router();
const { uploadMultiple } = require("../middlewares/uploadMiddleware");
const {
  getDashboardSummary,
  searchDashboard,
  aboutMeInfo,
  uploadFiles,
} = require("../controllers/dashboard.controller");
const authenticateToken = require("../../../shared/middleware/auth.middleware");
router.get("/getDashboardSummary", getDashboardSummary);
router.get("/search", searchDashboard);
router.get("/about-me", aboutMeInfo);
router.post("/uploadFiles", uploadMultiple, uploadFiles);
module.exports = router;
