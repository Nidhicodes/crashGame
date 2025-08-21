# Constants Configuration

This directory contains all the constant values used throughout the Crash Game application. These constants are organized by feature and will be replaced by API calls in the future.

## 📁 File Structure

```
constants/
├── index.ts          # Main export file with common constants
├── game.ts           # Game-related constants (phases, timing, jackpots)
├── betting.ts        # Betting-related constants (amounts, limits, messages)
├── referral.ts       # Referral system constants (rewards, limits, messages)
├── ui.ts            # UI-related constants (styles, layouts, animations)
├── faucet.ts        # Faucet-related constants (URLs, limits, cooldowns)
└── README.md        # This documentation file
```

## 🚀 Usage

### Import Constants

```typescript
// Import all constants
import { GAME_CONFIG, BETTING_CONFIG, REFERRAL_CONFIG } from '@/constants'

// Import specific constants
import { GAME_CONFIG } from '@/constants/game'
import { UI_STYLES } from '@/constants/ui'
```

### Example Usage

```typescript
// Using game constants
if (multiplier >= GAME_CONFIG.JACKPOTS.MEGA) {
  showJackpot(GAME_MESSAGES.JACKPOTS.MEGA)
}

// Using betting constants
const quickAmounts = BETTING_CONFIG.QUICK_AMOUNTS
const errorMessage = BETTING_MESSAGES.ERRORS.INVALID_AMOUNT

// Using UI constants
const cardStyle = `${UI_STYLES.BACKGROUNDS.CARD} ${UI_STYLES.BORDERS.PRIMARY}`
```

## 🔄 Future API Integration

### Current State
All values are hardcoded constants that provide default/fallback values.

### Future State
These constants will be replaced by:
1. **API calls** to fetch real-time data
2. **Configuration endpoints** for dynamic settings
3. **Database values** for user-specific configurations
4. **Environment variables** for deployment-specific settings

### Migration Strategy

1. **Phase 1**: Replace hardcoded values with API calls
2. **Phase 2**: Add loading states and error handling
3. **Phase 3**: Implement caching and offline fallbacks
4. **Phase 4**: Add real-time updates via WebSocket

### Example Migration

```typescript
// Before (Current)
const jackpotThreshold = GAME_CONFIG.JACKPOTS.MEGA

// After (Future)
const jackpotThreshold = await api.getGameConfig('jackpotThreshold')
```

## 📊 Constants Categories

### Game Constants (`game.ts`)
- Game phases and states
- Timing configurations
- Jackpot thresholds
- Game mechanics
- UI display limits

### Betting Constants (`betting.ts`)
- Quick bet amounts
- Bet limits and validation
- Conversion rates
- Phase-specific messages
- Button styling

### Referral Constants (`referral.ts`)
- Referral code format
- Reward amounts
- Usage limits
- Success/error messages
- Color schemes

### UI Constants (`ui.ts`)
- Layout configurations
- Spacing and animations
- Color schemes
- Responsive breakpoints
- Common messages

### Faucet Constants (`faucet.ts`)
- Faucet URLs
- Claim limits
- Cooldown periods
- Status messages
- Button states

## 🛠️ Maintenance

### Adding New Constants
1. Create constants in the appropriate feature file
2. Export them from the main `index.ts` file
3. Update this README if needed
4. Add TypeScript types if applicable

### Updating Constants
1. Update the constant value
2. Update any related documentation
3. Test the change across components
4. Consider if it should be moved to an API endpoint

### Removing Constants
1. Ensure no components are importing the constant
2. Remove from the feature file
3. Remove from `index.ts` if no longer exported
4. Update documentation

## 🔍 Best Practices

1. **Group Related Constants**: Keep constants organized by feature
2. **Use Descriptive Names**: Make constant names self-explanatory
3. **Add Comments**: Document what each constant represents
4. **Type Safety**: Use TypeScript for better development experience
5. **Consistent Format**: Follow the established naming conventions
6. **Version Control**: Track changes to constants in git

## 📝 Notes

- All constants are currently synchronous and static
- Future versions will support async loading and real-time updates
- Constants are designed to be easily searchable and replaceable
- Consider using environment variables for deployment-specific values
- Add validation for constant values when migrating to APIs 