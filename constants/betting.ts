// Betting Configuration Constants
// These will be replaced by API calls in the future

export const BETTING_CONFIG = {
  // Quick bet amounts
  QUICK_AMOUNTS: [10, 25, 50, 100, 250, 500],
  
  // Bet limits
  LIMITS: {
    MIN_BET: 1,
    MAX_BET: 10000,
    DEFAULT_BET: 10
  },

  // Conversion rates
  CONVERSION: {
    TOKENS_TO_POINTS: 1, // 1 token = 1 point
    POINTS_TO_TOKENS: 1  // 1 point = 1 token
  },

  // Betting phases
  PHASES: {
    BETTING: "betting",
    FLYING: "flying",
    CRASHED: "crashed", 
    WAITING: "waiting"
  },

  // UI configurations
  UI: {
    ERROR_DISPLAY_DURATION: 3000, // 3 seconds
    BUTTON_HEIGHT: "h-12",
    INPUT_PLACEHOLDER: "Enter bet amount"
  }
}

export const BETTING_MESSAGES = {
  PHASES: {
    betting: {
      title: "Place Your Bet",
      subtitle: "Choose your bet amount and wait for the game to start",
      button: "Place Bet"
    },
    flying: {
      title: "Game in Progress", 
      subtitle: "Watch the multiplier grow and cash out when ready",
      button: "Cash Out Now!"
    },
    crashed: {
      title: "Game Crashed",
      subtitle: "Wait for the next round to begin",
      button: "Round Crashed!"
    },
    waiting: {
      title: "Preparing Next Round",
      subtitle: "Get ready for the upcoming game", 
      button: "Get ready"
    }
  },

  ERRORS: {
    INVALID_AMOUNT: "Invalid amount or insufficient points",
    INSUFFICIENT_POINTS: "Not enough points for this bet",
    BETTING_DISABLED: "Betting is currently disabled"
  },

  SUCCESS: {
    BET_PLACED: "Bet placed successfully!",
    CASHED_OUT: "Successfully cashed out!"
  }
}

export const BETTING_COLORS = {
  PHASES: {
    betting: {
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    flying: {
      color: "text-green-400", 
      bgColor: "bg-green-500/20"
    },
    crashed: {
      color: "text-red-400",
      bgColor: "bg-red-500/20"
    },
    waiting: {
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20"
    }
  },

  BUTTONS: {
    PLACE_BET: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
    CASH_OUT: "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600",
    DISABLED: "bg-gray-600",
    QUICK_AMOUNT: "border-purple-500/30 text-purple-300 hover:bg-purple-900/40 hover:border-purple-500/50"
  }
} 