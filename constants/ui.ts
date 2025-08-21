// UI Configuration Constants
// These will be replaced by API calls in the future

export const UI_CONFIG = {
  // Layout configurations
  LAYOUT: {
    GRID_COLUMNS: {
      MOBILE: 1,
      TABLET: 3,
      DESKTOP: 5
    },
    SIDEBAR_WIDTH: "lg:col-span-1",
    MAIN_CONTENT_WIDTH: "lg:col-span-3",
    GAP: 6,
    CONTAINER_PADDING: "px-4 py-6"
  },

  // Spacing configurations
  SPACING: {
    SECTION_GAP: "space-y-6",
    LARGE_SECTION_GAP: "space-y-8",
    CARD_PADDING: "p-6",
    LARGE_CARD_PADDING: "p-8",
    BUTTON_PADDING: "px-6 py-3"
  },

  // Animation configurations
  ANIMATIONS: {
    DURATION: {
      FAST: 150,
      NORMAL: 200,
      SLOW: 300
    },
    TRANSITIONS: {
      DEFAULT: "transition-all duration-200",
      FAST: "transition-all duration-150",
      SLOW: "transition-all duration-300"
    },
    HOVER_EFFECTS: {
      SCALE: "transform hover:scale-105",
      OPACITY: "hover:opacity-80",
      SHADOW: "hover:shadow-lg"
    }
  },

  // Color schemes
  COLORS: {
    PRIMARY: {
      purple: "purple",
      blue: "blue",
      green: "green",
      yellow: "yellow",
      red: "red"
    },
    GRADIENTS: {
      PRIMARY: "from-purple-600 to-purple-700",
      SECONDARY: "from-blue-600 to-purple-600",
      SUCCESS: "from-green-600 to-green-700",
      WARNING: "from-yellow-500 to-orange-500",
      DANGER: "from-red-500 to-red-600"
    }
  }
}

export const UI_STYLES = {
  // Background styles
  BACKGROUNDS: {
    PRIMARY: "bg-gradient-to-br from-black via-purple-950 to-black",
    CARD: "bg-black/40 backdrop-blur-sm",
    CARD_ENHANCED: "bg-gradient-to-br from-black/60 via-purple-950/30 to-black/60 backdrop-blur-sm",
    HEADER: "bg-gradient-to-r from-purple-900/40 via-purple-800/30 to-purple-900/40"
  },

  // Border styles
  BORDERS: {
    PRIMARY: "border border-purple-500/20",
    ENHANCED: "border border-purple-500/30",
    COLORED: "border-purple-500/30",
    SUCCESS: "border-green-500/20",
    WARNING: "border-yellow-500/20",
    DANGER: "border-red-500/20"
  },

  // Shadow styles
  SHADOWS: {
    PRIMARY: "shadow-xl shadow-purple-500/10",
    ENHANCED: "shadow-2xl shadow-purple-500/20",
    BUTTON: "shadow-lg shadow-purple-500/25",
    GLOW: "shadow-2xl shadow-purple-500/25"
  },

  // Border radius
  RADIUS: {
    SMALL: "rounded-lg",
    MEDIUM: "rounded-xl", 
    LARGE: "rounded-2xl",
    FULL: "rounded-full"
  }
}

export const UI_MESSAGES = {
  // Common messages
  COMMON: {
    LOADING: "Loading...",
    ERROR: "An error occurred",
    SUCCESS: "Operation successful",
    NO_DATA: "No data available"
  },

  // Button text
  BUTTONS: {
    SUBMIT: "Submit",
    CANCEL: "Cancel",
    CONFIRM: "Confirm",
    CLOSE: "Close",
    REFRESH: "Refresh"
  },

  // Status messages
  STATUS: {
    CONNECTING: "Connecting...",
    CONNECTED: "Connected",
    DISCONNECTED: "Disconnected",
    ERROR: "Connection Error"
  }
}

export const UI_BREAKPOINTS = {
  // Responsive breakpoints
  MOBILE: "sm",
  TABLET: "md", 
  DESKTOP: "lg",
  LARGE_DESKTOP: "xl",
  EXTRA_LARGE: "2xl"
} 