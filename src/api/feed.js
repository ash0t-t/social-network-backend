const express = require("express");
const FeedService = require("../services/feed");
const { authenticateToken } = require("../core/auth");
const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const feed = await FeedService.getFeed(req.user.id);
    res.json(feed);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
