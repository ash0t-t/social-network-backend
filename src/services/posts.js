const Post = require("../models/posts");
const User = require("../models/users");

class PostService {
  static async createPost(data) {
    const { content, image, author } = data;

    const post = new Post({ content, image, author });
    await post.save();

    return post;
  }

  static async likePost(postId, userId) {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    if (post.likes.includes(userId))
      throw new Error("You already liked this post");

    post.likes.push(userId);
    await post.save();

    return post;
  }

  static async unlikePost(postId, userId) {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    post.likes = post.likes.filter((id) => id.toString() !== userId);
    await post.save();

    return post;
  }

  static async getPostById(postId) {
    const post = await Post.findById(postId)
      .populate("author")
      .populate("comments");
    if (!post) throw new Error("Post not found");

    return post;
  }
}

module.exports = PostService;
