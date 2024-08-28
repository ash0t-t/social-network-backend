const express = require("express");
const multer = require("multer");
const UserService = require("../services/users");
const { authenticateToken } = require("../core/auth");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/upload",
  authenticateToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      const photo = await UserService.uploadProfilePicture(
        req.user.id,
        req.file
      );
      res.status(201).send({ photo_id: photo._id });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/cdn/:photo_id", async (req, res) => {
  try {
    const photo = await UserService.getProfilePicture(req.params.photo_id);

    res.set("Content-Type", photo.contentType);
    res.send(photo.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
