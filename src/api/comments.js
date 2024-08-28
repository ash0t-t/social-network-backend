const express = require("express");
const CommentService = require("../services/comments");
const { authenticateToken } = require("../core/auth");
const router = express.Router();

router.post("/:postId", authenticateToken, async (req, res) => {
  try {
    const comment = await CommentService.createComment(req.params.postId, {
      ...req.body,
      author: req.user.id,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/:id/like", authenticateToken, async (req, res) => {
  try {
    const comment = await CommentService.likeComment(
      req.params.id,
      req.user.id
    );
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
