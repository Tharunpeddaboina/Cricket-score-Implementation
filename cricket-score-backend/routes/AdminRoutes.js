const express = require("express");
const router = express.Router();
const Score = require("../models/scoreSchema");

// Fetch current score
router.get("/current", async (req, res) => {
  try {
    const score = await Score.findOne();
    if (!score) {
      return res.status(404).json({ message: "No match data found" });
    }
    res.json(score);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update score (runs/wicket for current ball)
router.post("/update", async (req, res) => {
  const { runs, isOut } = req.body;

  // Validate input data
  if (runs === undefined || isOut === undefined) {
    return res.status(400).json({ message: "Missing 'runs' or 'isOut' in request body." });
  }

  try {
    let score = await Score.findOne();
    if (!score) {
      score = new Score();
    }

    // Find the current over
    let currentOver = score.overs[score.overs.length - 1];
    if (!currentOver || currentOver.balls.length === 6) {
      // Start a new over if the current over is complete or doesn't exist
      currentOver = { overNumber: score.currentScore.overs + 1, balls: [] };
      score.overs.push(currentOver);
    }

    // Add the current ball data
    currentOver.balls.push({ run: runs, out: isOut });

    // Update the total score
    score.currentScore.runs += runs;
    if (isOut) score.currentScore.wickets += 1;

    // If over is complete, increment the completed overs count
    if (currentOver.balls.length === 6) {
      score.currentScore.overs += 1;
    }

    await score.save();
    res.json({ message: "Score updated", score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
