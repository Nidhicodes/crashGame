// Game Configuration Constants
// These will be replaced by API calls in the future

export const GAME_CONFIG = {
  // Game phases
  PHASES: {
    BETTING: "betting",
    FLYING: "flying", 
    CRASHED: "crashed",
    WAITING: "waiting"
  } as const,

  // Timing configurations
  TIMING: {
    BETTING_DURATION: 30, // seconds
    WAITING_DURATION: 5,  // seconds
    MIN_MULTIPLIER: 1.0,
    MAX_MULTIPLIER: 1000.0
  },

  // Jackpot thresholds
  JACKPOTS: {
    MEGA: 5000,
    SUPER: 1250,
    REGULAR: 75
  },

  // Game mechanics
  MECHANICS: {
    CRASH_POINT_MIN: 1.0,
    CRASH_POINT_MAX: 15.0,
    CRASH_PROBABILITY: {
      LOW: 0.5,    // 50% chance for 1x-3x
      MEDIUM: 0.3, // 30% chance for 3x-10x
      HIGH: 0.2    // 20% chance for 10x+
    }
  },

  // UI configurations
  UI: {
    MAX_ACTIVE_PLAYERS_DISPLAY: 8,
    MAX_GAME_HISTORY_DISPLAY: 20,
    ANIMATION_DURATION: 200,
    PULSE_INTERVAL: 1000
  }
}

export const GAME_MESSAGES = {
  PHASES: {
    BETTING: "Place your bets now!",
    FLYING: "Game in progress",
    CRASHED: "Round ended",
    WAITING: "Get ready for the next round"
  },
  
  JACKPOTS: {
    MEGA: "MEGA JACKPOT!",
    SUPER: "SUPER JACKPOT!", 
    REGULAR: "JACKPOT!"
  },

  EMPTY_STATES: {
    NO_ACTIVE_PLAYERS: "No active players yet",
    NO_ACTIVE_PLAYERS_SUBTEXT: "Be the first to place a bet!"
  }
}

export const GAME_COLORS = {
  PHASES: {
    betting: "bg-blue-500 shadow-blue-500/50",
    flying: "bg-green-500 shadow-green-500/50", 
    crashed: "bg-red-500 shadow-red-500/50",
    waiting: "bg-yellow-500 shadow-yellow-500/50"
  },

  JACKPOTS: {
    MEGA: "bg-gradient-to-r from-purple-600 to-pink-600",
    SUPER: "bg-gradient-to-r from-yellow-500 to-orange-500",
    REGULAR: "bg-gradient-to-r from-orange-500 to-red-500"
  },

  MULTIPLIERS: {
    HIGH: "text-purple-400",
    MEDIUM: "text-yellow-400", 
    LOW: "text-green-400",
    CRASH: "text-red-400"
  }
} 