const Comment = require("../models/comments");
const Post = require("../models/posts");

class CommentService {
  static async createComment(postId, data) {
    const { author, content } = data;

    const comment = new Comment({ author, content });
    await comment.save();

    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();

    return comment;
  }

  static async likeComment(commentId, userId) {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found");

    if (comment.likes.includes(userId))
      throw new Error("You already liked this comment");

    comment.likes.push(userId);
    await comment.save();

    return comment;
  }
}

module.exports = CommentService;
