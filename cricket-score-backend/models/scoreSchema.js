const mongoose =require('mongoose')

const scoreSchema = new mongoose.Schema({
  currentScore: {
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    overs: { type: Number, default: 0 },
    overs: [
      {
        overNumber: { type: Number },
        balls: [{ run: Number, out: Boolean }],
      },
    ],
  },
});

module.exports = mongoose.model("Score", scoreSchema);
