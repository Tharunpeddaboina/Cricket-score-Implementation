const express = require('express');
const router = express.Router();
const Score = require('../models/scoreSchema');

// Fetch live scores
router.get('/score', async (req, res) => {
    try {
        const score = await Score.findOne();
        if (!score) {
            return res.status(404).json({ message: 'No live match data found. Please check back later.' });
        }
        res.json(score);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching live scores.' });
    }
});

// Fetch completed overs
router.get('/overs', async (req, res) => {
    try {
        const score = await Score.findOne({}, { overs: 1, _id: 0 }); // Fetch only 'overs' field
        if (!score || !score.overs.length) {
            return res.status(404).json({ message: 'No overs data available yet.' });
        }
        res.json(score.overs);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching completed overs.' });
    }
});

module.exports = router;
