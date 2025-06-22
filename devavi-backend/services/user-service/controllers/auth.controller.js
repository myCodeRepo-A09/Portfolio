const User = require("../models/user.model");
const redis = require("../utils/redisClient");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    return res.status(201).json({
      message: "User Created",
      user: { email: User.email, name: User.name },
    });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Registration Failed", message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check if email present in database
    const user = User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const payload = { id: user._id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    await redis.setEx(`refresh:${user._id}`, refreshToken, {
      EX: 7 * 24 * 60 * 60,
    });
    res.json({ accessToken, refreshToken });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Login Failed", message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  const redis = req.app.locals.redis;
  const { refreshToken } = req.body;

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const storedToken = await redis.get(`refresh:${decoded.id}`);

    if (storedToken !== refreshToken)
      return res.status(403).json({ error: "Invalid refresh token" });

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
    });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ error: "Token expired or invalid" });
  }
};

exports.logout = async (req, res) => {
  const redis = req.app.locals.redis;
  const { userId } = req.body;

  await redis.del(`refresh:${userId}`);
  res.json({ message: "Logged out successfully" });
};
