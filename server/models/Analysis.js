import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
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

  moves: [
    {
      index: Number,
      fen: String,
      playedMove: String,
      eval: Number,
      bestMove: String,
      pv: String
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;