const redisClient = require("../core/redis");
const Post = require("../models/posts");
const User = require("../models/users");

class FeedService {
  static async getFeed(userId) {
    try {
      const cachedFeed = await redisClient.getAsync(`feed:${userId}`);
      console.log(cachedFeed);
      if (cachedFeed) {
        return JSON.parse(cachedFeed);
      }

      const user = await User.findById(userId).populate("following");
      const followingIds = user.following.map((user) => user._id);

      const posts = await Post.find({ author: { $in: followingIds } })
        .sort({ created: -1 })
        .limit(10);

      redisClient.setex(`feed:${userId}`, 3600, JSON.stringify(posts));
      return posts;
    } catch (err) {
      throw new Error(`Error fetching feed: ${err.message}`);
    }
  }
}

module.exports = FeedService;
