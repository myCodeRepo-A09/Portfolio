const express = require("express");
const router = express.Router();
const messageController = require("../controllers/chat.controller");

router.post("/", messageController.sendMessage);
router.get("/", messageController.getMessages);
router.patch("/:messageId/read", messageController.markAsRead);

module.exports = router;
