# Migration Guide: Constants to API Calls

This guide shows you how to migrate from hardcoded constants to dynamic API calls in your Crash Game application.

## 🚀 Quick Start

### 1. Import Constants (Current Usage)

```typescript
import { GAME_CONFIG, BETTING_CONFIG, REFERRAL_CONFIG } from '@/constants'

// Use constants directly
const jackpotThreshold = GAME_CONFIG.JACKPOTS.MEGA
const quickAmounts = BETTING_CONFIG.QUICK_AMOUNTS
const referralReward = REFERRAL_CONFIG.REWARDS.POINTS_PER_REFERRAL
```

### 2. Replace with API Calls (Future Usage)

```typescript
import { configService } from '@/services/api'

// Get configuration dynamically
const gameConfig = await configService.getGameConfig()
const jackpotThreshold = gameConfig.jackpots.mega

// Or get specific values
const jackpotThreshold = await configService.getConfigValue('game', 'jackpots.mega')
```

## 📋 Migration Examples

### Game Configuration

```typescript
// Before (Constants)
import { GAME_CONFIG } from '@/constants'

const getGameStatusColor = (phase: string) => {
  switch (phase) {
    case GAME_CONFIG.PHASES.BETTING:
      return "bg-blue-500"
    case GAME_CONFIG.PHASES.FLYING:
      return "bg-green-500"
    // ... more cases
  }
}

// After (API)
import { configService } from '@/services/api'

const getGameStatusColor = async (phase: string) => {
  const gameConfig = await configService.getGameConfig()
  const phases = gameConfig.phases
  
  switch (phase) {
    case phases.betting:
      return "bg-blue-500"
    case phases.flying:
      return "bg-green-500"
    // ... more cases
  }
}
```

### Betting Configuration

```typescript
// Before (Constants)
import { BETTING_CONFIG } from '@/constants'

const quickAmounts = BETTING_CONFIG.QUICK_AMOUNTS
const maxBet = BETTING_CONFIG.LIMITS.MAX_BET

// After (API)
import { configService } from '@/services/api'

const [quickAmounts, maxBet] = await Promise.all([
  configService.getConfigValue('betting', 'quickAmounts'),
  configService.getConfigValue('betting', 'limits.maxBet')
])
```

### Referral Configuration

```typescript
// Before (Constants)
import { REFERRAL_CONFIG } from '@/constants'

const generateReferralCode = () => {
  const prefix = REFERRAL_CONFIG.CODE_FORMAT.PREFIX
  const length = REFERRAL_CONFIG.CODE_FORMAT.LENGTH
  // ... generate code
}

// After (API)
import { configService } from '@/services/api'

const generateReferralCode = async () => {
  const referralConfig = await configService.getReferralConfig()
  const prefix = referralConfig.codeFormat.prefix
  const length = referralConfig.codeFormat.length
  // ... generate code
}
```

## 🔄 Step-by-Step Migration Process

### Phase 1: Prepare Components
1. **Identify constant usage** in your components
2. **Add loading states** for async operations
3. **Add error handling** for API failures
4. **Create fallback values** for offline scenarios

### Phase 2: Replace Constants
1. **Import API service** instead of constants
2. **Convert synchronous code** to async/await
3. **Update component state** to handle loading
4. **Test API integration** thoroughly

### Phase 3: Optimize Performance
1. **Implement caching** for configuration data
2. **Add real-time updates** via WebSocket
3. **Optimize API calls** with batching
4. **Add offline support** with service workers

## 📝 Component Migration Examples

### GameStatus Component

```typescript
// Before
import { GAME_CONFIG, GAME_MESSAGES } from '@/constants'

export function GameStatus({ gameState }: GameStatusProps) {
  const getGameStatusColor = () => {
    switch (gameState.phase) {
      case GAME_CONFIG.PHASES.BETTING:
        return "bg-blue-500"
      // ... more cases
    }
  }

  return (
    <div>
      <h2>{GAME_MESSAGES.PHASES[gameState.phase]}</h2>
      {/* ... rest of component */}
    </div>
  )
}

// After
import { configService } from '@/services/api'
import { useState, useEffect } from 'react'

export function GameStatus({ gameState }: GameStatusProps) {
  const [gameConfig, setGameConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await configService.getGameConfig()
        setGameConfig(config)
      } catch (error) {
        console.error('Failed to load game config:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadConfig()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!gameConfig) return <div>Failed to load configuration</div>

  const getGameStatusColor = () => {
    switch (gameState.phase) {
      case gameConfig.phases.betting:
        return "bg-blue-500"
      // ... more cases
    }
  }

  return (
    <div>
      <h2>{gameConfig.messages?.phases?.[gameState.phase] || 'Unknown Phase'}</h2>
      {/* ... rest of component */}
    </div>
  )
}
```

### BettingControls Component

```typescript
// Before
import { BETTING_CONFIG, BETTING_MESSAGES } from '@/constants'

export function BettingControls({ gameState, playerStats, onPlaceBet, onCashOut }: BettingControlsProps) {
  const quickAmounts = BETTING_CONFIG.QUICK_AMOUNTS
  
  return (
    <div>
      {quickAmounts.map(amount => (
        <Button key={amount} onClick={() => setBetAmount(amount.toString())}>
          {amount}
        </Button>
      ))}
      <p>{BETTING_MESSAGES.INFO.DAILY_LIMIT}</p>
    </div>
  )
}

// After
import { configService } from '@/services/api'
import { useState, useEffect } from 'react'

export function BettingControls({ gameState, playerStats, onPlaceBet, onCashOut }: BettingControlsProps) {
  const [bettingConfig, setBettingConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await configService.getBettingConfig()
        setBettingConfig(config)
      } catch (error) {
        console.error('Failed to load betting config:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadConfig()
  }, [])

  if (loading) return <div>Loading betting options...</div>
  if (!bettingConfig) return <div>Failed to load betting configuration</div>

  return (
    <div>
      {bettingConfig.quickAmounts.map(amount => (
        <Button key={amount} onClick={() => setBetAmount(amount.toString())}>
          {amount}
        </Button>
      ))}
      <p>{bettingConfig.messages?.info?.dailyLimit || 'Get free tokens daily'}</p>
    </div>
  )
}
```

## 🛠️ Error Handling & Fallbacks

### Graceful Degradation

```typescript
const getConfigWithFallback = async (category: string, key: string, fallback: any) => {
  try {
    return await configService.getConfigValue(category, key)
  } catch (error) {
    console.warn(`Failed to load ${category}.${key}, using fallback:`, error)
    return fallback
  }
}

// Usage
const jackpotThreshold = await getConfigWithFallback('game', 'jackpots.mega', 5000)
```

### Loading States

```typescript
const [config, setConfig] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  const loadConfig = async () => {
    try {
      setLoading(true)
      const data = await configService.getGameConfig()
      setConfig(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  loadConfig()
}, [])

if (loading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
if (!config) return <NoDataMessage />
```

## 📊 Performance Considerations

### Caching Strategy

```typescript
// The ConfigurationService already implements basic caching
// You can extend it with more sophisticated caching:

class EnhancedConfigurationService extends ConfigurationService {
  private cacheExpiry = 5 * 60 * 1000 // 5 minutes
  private cacheTimestamps = new Map<string, number>()

  async getGameConfig(): Promise<GameConfig> {
    const now = Date.now()
    const cached = this.cacheTimestamps.get('game')
    
    if (this.gameConfig && cached && (now - cached) < this.cacheExpiry) {
      return this.gameConfig
    }
    
    this.gameConfig = await super.getGameConfig()
    this.cacheTimestamps.set('game', now)
    return this.gameConfig
  }
}
```

### Batch API Calls

```typescript
// Instead of multiple individual calls:
const gameConfig = await configService.getGameConfig()
const bettingConfig = await configService.getBettingConfig()
const referralConfig = await configService.getReferralConfig()

// Use batch loading:
const [gameConfig, bettingConfig, referralConfig] = await Promise.all([
  configService.getGameConfig(),
  configService.getBettingConfig(),
  configService.getReferralConfig()
])
```

## 🔮 Future Enhancements

### Real-time Updates

```typescript
// WebSocket integration for live configuration updates
useEffect(() => {
  const ws = new WebSocket('wss://api.quranium.org/ws/config')
  
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data)
    if (update.type === 'CONFIG_UPDATE') {
      // Refresh configuration
      configService.refreshConfigurations()
    }
  }
  
  return () => ws.close()
}, [])
```

### Environment-based Configuration

```typescript
// Use environment variables for different deployments
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.quranium.org'
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000')
```

## 📚 Additional Resources

- [API Service Documentation](./api.md)
- [Constants Reference](./README.md)
- [Error Handling Guide](./error-handling.md)
- [Performance Optimization](./performance.md)

## 🆘 Need Help?

If you encounter issues during migration:

1. Check the [API Service](./api.md) documentation
2. Review the [Error Handling Guide](./error-handling.md)
3. Test with the [Development API](./dev-api.md)
4. Contact the development team

Remember: The goal is to make your application more dynamic and maintainable. Take your time with the migration and test thoroughly at each step! 