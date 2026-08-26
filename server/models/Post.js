import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["lost", "found", "claimed", "recovered"],
      default: function () {
        return this.type; // status starts the same as type
      },
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }

);

postSchema.index({ title: "text", description: "text" });

postSchema.index({ type: 1, category: 1, location: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;