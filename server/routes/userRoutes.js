const router = require("express").Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
  try {
    const search = req.query.search || "";

    const users = await User.find(
      search
        ? { username: { $regex: search, $options: "i" } }
        : {}
    ).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;