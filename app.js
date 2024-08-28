const express = require("express");
const connectDB = require("./src/core/db");
const { authenticateToken } = require("./src/core/auth");
require("dotenv").config();

const app = express();

connectDB();

app.use(express.json());

app.use("/users", require("./src/api/users"));
app.use("/posts", require("./src/api/posts"));
app.use("/comments", require("./src/api/comments"));
app.use("/feed", authenticateToken, require("./src/api/feed"));
app.use("/photos", require("./src/api/photos"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
