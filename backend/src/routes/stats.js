const express = require('express');
const router = express.Router();
const UserGameHistory = require('../models/UserGameHistory');
const GameStats = require('../models/GameStats');

// Get daily stats
router.get('/daily', async (req, res) => {
    try {
        const stats = await GameStats.find({ period: 'daily' }).sort({ date: -1 }).limit(30);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch daily stats' });
    }
});

// Get weekly stats
router.get('/weekly', async (req, res) => {
    try {
        const stats = await GameStats.find({ period: 'weekly' }).sort({ date: -1 }).limit(12);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch weekly stats' });
    }
});


// Get full game history of user
router.get('/:walletAddress', async (req, res) => {
  try {
    const history = await UserGameHistory.find({ walletAddress: req.params.walletAddress }).sort({ timestamp: -1 });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch history' });
  }
});

module.exports = router;
