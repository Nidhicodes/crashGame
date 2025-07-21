const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true
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
  }
});

const gameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  crashMultiplier: {
    type: Number,
    required: true
  },
  crashTime: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true,
    index: true
  },
  totalPlayers: {
    type: Number,
    default: 0
  },
  totalBets: {
    type: Number,
    default: 0
  },
  isJackpot: {
    type: Boolean,
    default: false
  },
  participants: [participantSchema]
}, {
  timestamps: true
});

// Calculate if it's a jackpot
gameSchema.pre('save', function(next) {
  this.isJackpot = this.crashMultiplier >= 75;
  this.totalPlayers = this.participants.length;
  this.totalBets = this.participants.reduce((sum, p) => sum + p.betAmount, 0);
  next();
});

module.exports = mongoose.model('Game', gameSchema);