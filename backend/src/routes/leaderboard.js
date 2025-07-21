const express = require('express');
const router = express.Router();
const Leaderboard = require('../models/Leaderboard');

// GET latest leaderboard by type
router.get('/:type', async (req, res) => {
  const { type } = req.params;
  try {
    const board = await Leaderboard.findOne({ type }).sort({ period: -1 });
    if (!board) return res.status(404).json({ error: 'Leaderboard not found' });

    res.status(200).json(board);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
