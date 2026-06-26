const router = require("express").Router();
const Message = require("../models/Message");
const protect = require("../middleware/authMiddleware");

// GET MESSAGES
router.get("/:userId", protect, async (req, res) => {
  const messages = await Message.find({
    $or: [
      { senderId: req.user.id, receiverId: req.params.userId },
      { senderId: req.params.userId, receiverId: req.user.id },
    ],
  });

  res.json(messages);
});

// SEND MESSAGE
router.post("/", protect, async (req, res) => {
  const { receiverId, message } = req.body;

  const newMsg = await Message.create({
    senderId: req.user.id,
    receiverId,
    message,
  });

  res.json(newMsg);
});

module.exports = router;