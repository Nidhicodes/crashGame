const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  username: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  stats: {
    totalGamesPlayed: {
      type: Number,
      default: 0
    },
    totalWon: {
      type: Number,
      default: 0
    },
    totalLost: {
      type: Number,
      default: 0
    },
    winRate: {
      type: Number,
      default: 0
    },
    bestMultiplier: {
      type: Number,
      default: 0
    },
    totalWinnings: {
      type: Number,
      default: 0
    },
    currentTokens: {
      type: Number,
      default: 0
    },
    currentPoints: {
      type: Number,
      default: 100
    },
    rank: {
      type: Number,
      default: 0
    },
    averageMultiplier: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Update lastActive on every save
userSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

// Calculate win rate
userSchema.methods.calculateWinRate = function() {
  if (this.stats.totalGamesPlayed === 0) return 0;
  return (this.stats.totalWon / this.stats.totalGamesPlayed) * 100;
};

module.exports = mongoose.model('User', userSchema);