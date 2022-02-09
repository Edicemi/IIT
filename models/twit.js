const mongoose = require("mongoose");
const tweetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    tweet: {
      type: String,
      reqired: true,
    },
    comment: [
      {
        type: mongoose.Types.ObjectId,
        ref: "comment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("tweet", tweetSchema);
