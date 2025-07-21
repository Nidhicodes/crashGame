const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const User = require('../models/User');
const UserGameHistory = require('../models/UserGameHistory');
const { validateGameResult } = require('../middleware/validation');

// Submit game result (add to Game + update user + add history)
router.post('/', validateGameResult, async (req, res) => {
  const {
    gameId, betAmount, targetMultiplier,
    cashedOutAt, cashedOutTime, winnings, won, walletAddress
  } = req.body;

  try {
    // Save game participant
    let game = await Game.findOne({ gameId });
    if (!game) {
      game = new Game({
        gameId,
        crashMultiplier: cashedOutAt || 1,
        crashTime: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        participants: []
      });
    }

    game.participants.push({
      walletAddress,
      betAmount,
      targetMultiplier,
      cashedOutAt,
      cashedOutTime,
      winnings,
      won
    });

    await game.save();

    // Update user stats
    const user = await User.findOne({ walletAddress });
    if (user) {
      user.stats.totalGamesPlayed += 1;
      if (won) {
        user.stats.totalWon += 1;
        user.stats.totalWinnings += winnings;
        user.stats.currentPoints += winnings;
      } else {
        user.stats.totalLost += 1;
        user.stats.currentPoints -= betAmount;
      }

      user.stats.winRate = user.calculateWinRate();
      await user.save();
    }

    // Save to history
    const history = new UserGameHistory({
      walletAddress,
      gameId,
      betAmount,
      targetMultiplier,
      cashedOutAt,
      cashedOutTime,
      winnings,
      won
    });
    await history.save();

    res.status(201).json({ message: 'Game result saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save game result' });
  }
});

// Get latest game
router.get('/latest', async (req, res) => {
  try {
    const game = await Game.findOne().sort({ endTime: -1 }).limit(1);
    if (!game) return res.status(404).json({ error: 'No game found' });
    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching game' });
  }
});

module.exports = router;
