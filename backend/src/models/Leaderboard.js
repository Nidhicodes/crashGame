const mongoose = require('mongoose');

const rankingSchema = new mongoose.Schema({
  rank: Number,
  walletAddress: String,
  username: String,
  score: Number,
  gamesPlayed: Number,
  winRate: Number,
  totalWinnings: Number,
  bestMultiplier: Number
});

const leaderboardSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'allTime'],
    required: true
  },
  period: {
    type: Date,
    required: true
  },
  rankings: [rankingSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
leaderboardSchema.index({ type: 1, period: 1 }, { unique: true });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);