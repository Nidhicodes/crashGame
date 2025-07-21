const mongoose = require('mongoose');

const userGameHistorySchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    index: true
  },
  gameId: {
    type: String,
    required: true,
    index: true
  },
  betAmount: {
    type: Number,
    required: true
  },
  targetMultiplier: Number,
  cashedOutAt: {
    type: Number,
    default: null
  },
  cashedOutTime: {
    type: Date,
    default: null
  },
  winnings: {
    type: Number,
    default: 0
  },
  won: {
    type: Boolean,
    default: false
  },
  profit: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Calculate profit before saving
userGameHistorySchema.pre('save', function(next) {
  this.profit = this.winnings - this.betAmount;
  next();
});

module.exports = mongoose.model('UserGameHistory', userGameHistorySchema);