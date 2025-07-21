const express = require('express');
const router = express.Router();
const UserGameHistory = require('../models/UserGameHistory');

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
