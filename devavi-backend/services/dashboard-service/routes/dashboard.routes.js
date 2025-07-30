const router = require("express").Router();
const {
  getDashboardSummary,
  searchDashboard,
} = require("../controllers/dashboard.controller");
const authenticateToken = require("../../../shared/middleware/auth.middleware");
router.get("/getDashboardSummary", getDashboardSummary);
router.get("/search", searchDashboard);

module.exports = router;
