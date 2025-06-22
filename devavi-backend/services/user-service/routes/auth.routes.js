const router = require("express").Router();
const {
  register,
  login,
  refreshToken,
  logout,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

module.exports = router;
