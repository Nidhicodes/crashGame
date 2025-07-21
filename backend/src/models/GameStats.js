const mongoose = require('mongoose');

const gameStatsSchema = new mongoose.Schema({
  period: {
    type: String,
    required: true,
    enum: ['daily', 'weekly']
  },
  date: {
    type: Date,
    required: true
  },
  totalGames: {
    type: Number,
    default: 0
  },
  totalPlayers: {
    type: Number,
    default: 0
  },
  totalBets: {
    type: Number,
    default: 0
  },
  totalWinnings: {
    type: Number,
    default: 0
  },
  netProfit: {
    type: Number,
    default: 0
  },
  highestMultiplier: {
    type: Number,
    default: 0
  },
  averageMultiplier: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

gameStatsSchema.index({ period: 1, date: -1 });

module.exports = mongoose.model('GameStats', gameStatsSchema);
