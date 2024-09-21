import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  communityName: {
    type: String,
    required: true,
  },
  admin: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  subAdmin: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  blockedMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

const Community = mongoose.model("Community", communitySchema);

export default Community;
