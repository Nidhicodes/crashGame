// Main constants export file
// Import all constants from here for easy access

export * from './game'
export * from './betting'
export * from './referral'
export * from './ui'
export * from './faucet'

// Common constants that are used across multiple components
export const COMMON_CONFIG = {
  // App information
  APP: {
    NAME: "Quantum Crash",
    VERSION: "1.0.0",
    DESCRIPTION: "TestNet Demo Game",
    STATUS: "Live"
  },

  // Network information
  NETWORK: {
    NAME: "Quranium TestNet",
    CHAIN_ID: "0x3dfb48",
    RPC_URL: "https://tqrn-node1.quranium.org/node",
    EXPLORER: "https://explorer.quranium.org"
  },

  // Wallet configuration
  WALLET: {
    SUPPORTED_CHAINS: ["Quranium TestNet"],
    DEFAULT_CURRENCY: "QRN",
    DECIMALS: 18
  },

  // API endpoints (will be replaced with actual endpoints)
  API: {
    BASE_URL: "https://api.quranium.org",
    ENDPOINTS: {
      GAME_STATE: "/game/state",
      PLAYER_STATS: "/player/stats",
      PLACE_BET: "/game/bet",
      CASH_OUT: "/game/cashout",
      GAME_HISTORY: "/game/history",
      REFERRAL: "/referral",
      FAUCET: "/faucet/claim"
    }
  }
}

// Default values for components (will be replaced by API calls)
export const DEFAULT_VALUES = {
  PLAYER_STATS: {
    tokens: 0,
    points: 100,
    totalWon: 0,
    gamesPlayed: 0,
    winRate: 0,
    bestMultiplier: 0,
    rank: 0,
    faucetCooldown: 0
  },

  GAME_STATE: {
    phase: "waiting",
    currentMultiplier: 1.0,
    timeLeft: 5,
    activePlayers: [],
    playerBet: null
  },

  GAME_HISTORY: [],
  
  REFERRAL_STATS: {
    totalReferrals: 0,
    bonusPointsEarned: 0,
    bonusFaucetTokens: 0,
    hasUsedReferralCode: false
  }
} 