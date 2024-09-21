import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Refers to the 'Post' model
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
