const User = require("../models/user.model");
const redis = require("../../../shared/redis/redisClient");
const sendEmail = require("../utils/sendEmail");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });
    //check if user exist
    if (userExist) {
      return res.status(400).json({ error: "User already exists" });
    }
    //create new user
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
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const payload = { id: user._id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    +res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      sameSite: "strict", // or 'lax' depending on your needs
      maxAge: 15 * 60 * 1000, // 15 minutes (for access token)
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (for refresh token)
    });
    res.status(200).json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: { email: user.email, name: user.name },
    });
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

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");
  user.reset_password_token = token;
  user.reset_password_expires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetLink = `http://localhost:4200/reset-password/${token}`;
  await sendEmail(user.email, "Reset Password", `Reset here: ${resetLink}`);

  res.json({ message: "Reset link sent to your email" });
};

exports.resetPassword = async (req, res) => {
  const user = await User.findOne({
    reset_password_token: req.params.token,
    reset_password_expires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.password_hash = await bcrypt.hash(req.body.newPassword, 10);
  user.reset_password_token = undefined;
  user.reset_password_expires = undefined;
  await user.save();

  res.json({ message: "Password has been reset successfully" });
};
