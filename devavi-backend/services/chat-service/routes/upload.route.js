const express = require("express");
const multer = require("multer");
const path = require("path");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/", upload.single("file"), (req, res) => {
  const fileUrl = `http://localhost:4000/uploads/${req.file.filename}`;
  res.json({ fileUrl });
});

module.exports = router;
