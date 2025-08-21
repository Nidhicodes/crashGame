// Referral Configuration Constants
// These will be replaced by API calls in the future

export const REFERRAL_CONFIG = {
  // Referral code format
  CODE_FORMAT: {
    PREFIX: "QRN-",
    LENGTH: 6,
    CHARSET: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  },

  // Referral rewards
  REWARDS: {
    POINTS_PER_REFERRAL: 50,
    TOKENS_PER_REFERRAL: 25,
    BONUS_MULTIPLIER: 1.5
  },

  // Referral limits
  LIMITS: {
    MAX_REFERRALS_PER_USER: 100,
    MAX_BONUS_POINTS: 10000,
    MAX_BONUS_TOKENS: 5000
  },

  // UI configurations
  UI: {
    COPY_SUCCESS_DURATION: 2000, // 2 seconds
    MAX_REFERRAL_CODE_LENGTH: 20
  }
}

export const REFERRAL_MESSAGES = {
  SUCCESS: {
    CODE_COPIED: "Referral code copied to clipboard!",
    CODE_APPLIED: "Referral code applied! Bonus tokens unlocked.",
    REFERRAL_SUCCESS: "Referral successful! Bonus rewards added."
  },

  ERRORS: {
    COPY_FAILED: "Failed to copy referral code",
    INVALID_CODE: "Invalid referral code",
    CODE_ALREADY_USED: "You have already used a referral code",
    MAX_REFERRALS_REACHED: "Maximum referrals reached"
  },

  INFO: {
    SHARE_CODE: "Share this code to earn 50 points per referral!",
    ENTER_CODE: "Get bonus tokens when you enter a friend's code!",
    BONUS_DESCRIPTION: "Earn bonus rewards for every successful referral"
  }
}

export const REFERRAL_COLORS = {
  SUCCESS: {
    bg: "bg-green-900/20",
    border: "border-green-500/20",
    text: "text-green-300",
    icon: "text-green-400"
  },

  INFO: {
    bg: "bg-blue-900/20", 
    border: "border-blue-500/20",
    text: "text-blue-300",
    icon: "text-blue-400"
  },

  WARNING: {
    bg: "bg-yellow-900/20",
    border: "border-yellow-500/20", 
    text: "text-yellow-300",
    icon: "text-yellow-400"
  }
}

export const REFERRAL_STATS = {
  // Default referral statistics (will be replaced by API)
  DEFAULT: {
    totalReferrals: 3,
    bonusPointsEarned: 150,
    bonusFaucetTokens: 75,
    hasUsedReferralCode: false
  }
} 