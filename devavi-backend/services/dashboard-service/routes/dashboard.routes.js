const router = require("express").Router();
const { getDashboardSummary } = require("../controllers/dashboard.controller");
const authenticateToken = require("../../../shared/middleware/auth.middleware");
router.get("/getDashboardSummary", getDashboardSummary);

module.exports = router;
