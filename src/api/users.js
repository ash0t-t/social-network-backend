const express = require("express");
const UserService = require("../services/users");
const { authenticateToken } = require("../core/auth");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = await UserService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { token, user } = await UserService.login(req.body);
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/follow/:id", authenticateToken, async (req, res) => {
  try {
    const user = await UserService.follow(req.user.id, req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/unfollow/:id", authenticateToken, async (req, res) => {
  try {
    const user = await UserService.unfollow(req.user.id, req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
