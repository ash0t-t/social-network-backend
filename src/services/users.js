const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Photo = require("../models/photo");
require("dotenv").config();

class UserService {
  static async register(data) {
    const { email, username, password } = data;
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      throw new Error("User already exists");
    }
    user = new User({ email, username, password });
    await user.save();

    return user;
  }

  static async login(data) {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return { token, user };
  }

  static async follow(userId, followId) {
    const user = await User.findById(userId);
    const followUser = await User.findById(followId);

    if (!user || !followUser) throw new Error("User not found");

    if (user.following.includes(followId))
      throw new Error("Already following this user");

    user.following.push(followId);
    followUser.followers.push(userId);

    await user.save();
    await followUser.save();

    return user;
  }

  static async unfollow(userId, unfollowId) {
    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowId);

    if (!user || !unfollowUser) throw new Error("User not found");

    user.following = user.following.filter(
      (id) => id.toString() !== unfollowId
    );
    unfollowUser.followers = unfollowUser.followers.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await unfollowUser.save();

    return user;
  }
  static async uploadProfilePicture(userId, file) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const photo = new Photo({
      data: file.buffer,
      contentType: file.mimetype,
    });

    const savedPhoto = await photo.save();

    user.avatar = savedPhoto._id;
    await user.save();

    return savedPhoto;
  }

  static async getProfilePicture(photoId) {
    const photo = await Photo.findById(photoId);
    if (!photo) throw new Error("Photo not found");

    return photo;
  }
}

module.exports = UserService;
