// Faucet Configuration Constants
// These will be replaced by API calls in the future

export const FAUCET_CONFIG = {
  // Faucet URLs
  URLS: {
    MAIN_FAUCET: "https://faucet.quranium.org/",
    BACKUP_FAUCET: "https://backup-faucet.quranium.org/"
  },

  // Faucet limits
  LIMITS: {
    DAILY_CLAIMS: 1,
    COOLDOWN_HOURS: 24,
    MAX_TOKENS_PER_CLAIM: 100,
    MIN_TOKENS_PER_CLAIM: 10
  },

  // Cooldown configurations
  COOLDOWN: {
    DEFAULT_SECONDS: 0,
    MAX_SECONDS: 86400, // 24 hours
    WARNING_THRESHOLD: 3600 // 1 hour
  },

  // UI configurations
  UI: {
    BUTTON_HEIGHT: "h-12",
    DISABLED_OPACITY: "opacity-50",
    ENABLED_OPACITY: "opacity-100"
  }
}

export const FAUCET_MESSAGES = {
  SUCCESS: {
    CLAIM_SUCCESS: "Tokens claimed successfully!",
    CLAIM_PENDING: "Claim request submitted, tokens will arrive shortly"
  },

  ERRORS: {
    CLAIM_FAILED: "Failed to claim tokens",
    INSUFFICIENT_BALANCE: "Faucet balance is low",
    COOLDOWN_ACTIVE: "Please wait before claiming again",
    NETWORK_ERROR: "Network error, please try again"
  },

  INFO: {
    DAILY_LIMIT: "Get free tokens every 24 hours",
    COOLDOWN_ACTIVE: "Faucet is on cooldown",
    CLAIM_READY: "Faucet is ready for claiming"
  }
}

export const FAUCET_COLORS = {
  BUTTON: {
    ENABLED: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
    DISABLED: "bg-gray-600 cursor-not-allowed",
    COOLDOWN: "bg-yellow-600 cursor-not-allowed"
  },

  TEXT: {
    ENABLED: "text-white",
    DISABLED: "text-gray-400",
    COOLDOWN: "text-yellow-200"
  }
}

export const FAUCET_STATES = {
  READY: "ready",
  COOLDOWN: "cooldown",
  ERROR: "error",
  CLAIMING: "claiming"
} 