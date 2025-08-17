export interface GameState {
  phase: "betting" | "flying" | "crashed" | "waiting"
  currentMultiplier: number
  timeLeft: number
  activePlayers: Array<{
    name: string
    bet: number
    targetMultiplier: number
  }>
  playerBet: number | null
  crashPoint?: number
}

export interface PlayerStats {
  tokens: number
  points: number
  totalWon: number
  gamesPlayed: number
  winRate: number
  bestMultiplier: number
  rank: number
  faucetCooldown: number
}

export interface GameResult {
  id: string
  multiplier: number
  timestamp: Date
  players: number
  jackpot?: boolean
}

export interface Wallet {
  address: string | null
  balance: string | null
  chainId: number | null
  gasPrice: string | null
  clientVersion: string | null
  txCount: number | null
  network: string | null
}

export interface GameActions {
  onPlaceBet: (amount: number) => void
  onCashOut: () => void
  onConvertTokens: (amount: number) => void
  onConnectWallet: () => void
} 