const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;
