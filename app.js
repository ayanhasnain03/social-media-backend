import express from "express";
import mongoose, { Model, model } from "mongoose";
import User from "./models/user.model.js";
import Post from "./models/post.model.js";
import Community from "./models/community.model.js";
const app = express();
app.use(express.json());
const PORT = 3000;
mongoose.connect("mongodb://localhost:27017/practice2024").then(() => {
  console.log("db connected");
});

app.post("/create", async (req, res) => {
  const { username } = req.body;
  try {
    const newUser = User.create({ username });
    res.status(201).json({
      message: "User Created Successfully",
    });
  } catch (error) {}
});
app.post("/creatpost", async (req, res) => {
  const { title, body, id } = req.body;
  try {
    const user = await User.findById(id);
    const post = await Post.create({ title, body, author: id });
    user.posts.push(post._id);
    await user.save();
    res.status(201).json({
      message: "Post Created Successfully",
    });
  } catch (error) {}
});
app.get("/getuserposts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("posts");
    res.status(200).json(user.posts);
  } catch (error) {
    console.log(error.message);
  }
});
app.post("/likepost/:id", async (req, res) => {
  try {
    const { id } = req.params; // User ID
    const { postId } = req.body; // Post ID

    // Ensure the IDs are valid
    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(postId)
    ) {
      return res.status(400).json({ message: "Invalid user or post ID" });
    }

    const user = await User.findById(id);
    const post = await Post.findById(postId);

    // Check if the user and post exist
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user already liked the post
    const alreadyLikedUser = post.likedUser.includes(user._id);

    if (alreadyLikedUser) {
      return res.status(400).json({ message: "User already liked this post" });
    }

    // If not already liked, push user ID to likedUser and increment like count
    post.likedUser.push(user._id);
    post.like += 1;

    await post.save();

    res.status(201).json({
      message: "Post liked successfully",
    });
  } catch (error) {
    console.error("Error details:", error);
    res
      .status(500)
      .json({ message: "An error occurred while liking the post" });
  }
});
app.get("/postlikeduser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Find the post and populate the likedUser field with only the username
    const likepostbyUser = await Post.findById(id)
      .populate({
        path: "likedUser",
        select: "username ", // Only select the username
      })
      .sort({ like: -1 });

    if (!likepostbyUser) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(likepostbyUser.likedUser);
  } catch (error) {
    console.error("Error details:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the liked users" });
  }
});
app.post("/com/create", async (req, res) => {
  const { id } = req.body;
  const { communityName, admin } = req.body;
  await Community.create({ communityName, admin: id });
  res.status(201).json({
    message: "Community Created Successfully",
  });
});
app.post("/com/join", async (req, res) => {
  const { communityId, userId } = req.body;

  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already a member
    if (community.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is already a member of this community" });
    }

    community.members.push(userId);
    await community.save();

    res.json({ message: "User joined community successfully", community });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to join community" });
  }
});
app.listen(PORT, () => {
  console.log("--**-sever run--**-");
});
