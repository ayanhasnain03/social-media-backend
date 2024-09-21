import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
  },
  body: {
    type: String,
    required: true,
  },
  likedUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  like: {
    type: Number,
    default: 0,
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
