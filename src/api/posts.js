const express = require("express");
const PostService = require("../services/posts");
const { authenticateToken } = require("../core/auth");
const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const post = await PostService.createPost({
      ...req.body,
      author: req.user.id,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/:id/like", authenticateToken, async (req, res) => {
  try {
    const post = await PostService.likePost(req.params.id, req.user.id);
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/:id/unlike", authenticateToken, async (req, res) => {
  try {
    const post = await PostService.unlikePost(req.params.id, req.user.id);
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await PostService.getPostById(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
