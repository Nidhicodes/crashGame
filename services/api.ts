// API Service for Crash Game
// This will replace the hardcoded constants with real API calls

import { COMMON_CONFIG } from '@/constants'

// Types for API responses
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

interface GameConfig {
  phases: string[]
  timing: {
    bettingDuration: number
    waitingDuration: number
    minMultiplier: number
    maxMultiplier: number
  }
  jackpots: {
    mega: number
    super: number
    regular: number
  }
  mechanics: {
    crashPointMin: number
    crashPointMax: number
    crashProbability: {
      low: number
      medium: number
      high: number
    }
  }
}

interface BettingConfig {
  quickAmounts: number[]
  limits: {
    minBet: number
    maxBet: number
    defaultBet: number
  }
  conversion: {
    tokensToPoints: number
    pointsToTokens: number
  }
}

interface ReferralConfig {
  codeFormat: {
    prefix: string
    length: number
    charset: string
  }
  rewards: {
    pointsPerReferral: number
    tokensPerReferral: number
    bonusMultiplier: number
  }
  limits: {
    maxReferralsPerUser: number
    maxBonusPoints: number
    maxBonusTokens: number
  }
}

// Base API configuration
const API_CONFIG = {
  baseURL: COMMON_CONFIG.API.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
}

// API client class
class ApiClient {
  private baseURL: string
  private timeout: number
  private headers: Record<string, string>

  constructor(config: typeof API_CONFIG) {
    this.baseURL = config.baseURL
    this.timeout = config.timeout
    this.headers = config.headers
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...this.headers, ...options.headers },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout')
        }
        throw error
      }
      
      throw new Error('Unknown error occurred')
    }
  }

  // Game configuration API
  async getGameConfig(): Promise<GameConfig> {
    const response = await this.request<GameConfig>(COMMON_CONFIG.API.ENDPOINTS.GAME_STATE)
    return response.data
  }

  // Betting configuration API
  async getBettingConfig(): Promise<BettingConfig> {
    const response = await this.request<BettingConfig>('/betting/config')
    return response.data
  }

  // Referral configuration API
  async getReferralConfig(): Promise<ReferralConfig> {
    const response = await this.request<ReferralConfig>(COMMON_CONFIG.API.ENDPOINTS.REFERRAL)
    return response.data
  }

  // Player stats API
  async getPlayerStats(address: string) {
    const response = await this.request(`/player/${address}/stats`)
    return response.data
  }

  // Game history API
  async getGameHistory(address: string) {
    const response = await this.request(`/player/${address}/history`)
    return response.data
  }

  // Place bet API
  async placeBet(address: string, amount: number) {
    const response = await this.request(COMMON_CONFIG.API.ENDPOINTS.PLACE_BET, {
      method: 'POST',
      body: JSON.stringify({ address, amount })
    })
    return response.data
  }

  // Cash out API
  async cashOut(address: string) {
    const response = await this.request(COMMON_CONFIG.API.ENDPOINTS.CASH_OUT, {
      method: 'POST',
      body: JSON.stringify({ address })
    })
    return response.data
  }

  // Claim faucet API
  async claimFaucet(address: string) {
    const response = await this.request(COMMON_CONFIG.API.ENDPOINTS.FAUCET, {
      method: 'POST',
      body: JSON.stringify({ address })
    })
    return response.data
  }

  // Apply referral code API
  async applyReferralCode(address: string, code: string) {
    const response = await this.request('/referral/apply', {
      method: 'POST',
      body: JSON.stringify({ address, code })
    })
    return response.data
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_CONFIG)

// Configuration service that will replace constants
export class ConfigurationService {
  private gameConfig: GameConfig | null = null
  private bettingConfig: BettingConfig | null = null
  private referralConfig: ReferralConfig | null = null

  // Get game configuration (with caching)
  async getGameConfig(): Promise<GameConfig> {
    if (!this.gameConfig) {
      this.gameConfig = await apiClient.getGameConfig()
    }
    return this.gameConfig
  }

  // Get betting configuration (with caching)
  async getBettingConfig(): Promise<BettingConfig> {
    if (!this.bettingConfig) {
      this.bettingConfig = await apiClient.getBettingConfig()
    }
    return this.bettingConfig
  }

  // Get referral configuration (with caching)
  async getReferralConfig(): Promise<ReferralConfig> {
    if (!this.referralConfig) {
      this.referralConfig = await apiClient.getReferralConfig()
    }
    return this.referralConfig
  }

  // Refresh all configurations
  async refreshConfigurations() {
    this.gameConfig = null
    this.bettingConfig = null
    this.referralConfig = null
    
    await Promise.all([
      this.getGameConfig(),
      this.getBettingConfig(),
      this.getReferralConfig()
    ])
  }

  // Get specific configuration value
  async getConfigValue<T>(category: string, key: string): Promise<T> {
    switch (category) {
      case 'game':
        const gameConfig = await this.getGameConfig()
        return (gameConfig as any)[key]
      case 'betting':
        const bettingConfig = await this.getBettingConfig()
        return (bettingConfig as any)[key]
      case 'referral':
        const referralConfig = await this.getReferralConfig()
        return (referralConfig as any)[key]
      default:
        throw new Error(`Unknown configuration category: ${category}`)
    }
  }
}

// Export configuration service instance
export const configService = new ConfigurationService()

// Example usage of how constants will be replaced:
/*
// Before (using constants):
const jackpotThreshold = GAME_CONFIG.JACKPOTS.MEGA

// After (using API):
const jackpotThreshold = await configService.getConfigValue('game', 'jackpots.mega')

// Or with the full config:
const gameConfig = await configService.getGameConfig()
const jackpotThreshold = gameConfig.jackpots.mega
*/ 