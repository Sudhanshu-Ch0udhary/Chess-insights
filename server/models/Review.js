import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true,
    index: true
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  summary: {
    type: String,
    default: ""
  },

  blunders: {
    type: [Number],
    default: []
  },

  mistakes: {
    type: [Number],
    default: []
  },

  goodMoves: {
    type: [Number],
    default: []
  },

  accuracy: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
