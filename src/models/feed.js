const mongoose = require("mongoose");

const FeedSchema = new mongoose.Schema({
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

module.exports = mongoose.model("Feed", FeedSchema);
