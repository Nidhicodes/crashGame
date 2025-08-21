# Crash Game - Betting Platform

A modern crash betting game built with Next.js, featuring real-time updates and a clean, modular architecture.

## Project Structure

### Layout Components

The application follows a clean, layered architecture:

```
app/
├── layout.tsx          # Root layout with theme provider
├── page.tsx            # Main game page (clean and focused)
└── globals.css         # Global styles

components/
├── game-layout.tsx     # Game-specific layout with background
├── game-content.tsx    # Main content grid structure
├── game-controller.tsx # Game state and logic management
├── game-header.tsx     # Header with wallet connection
├── main-game-area.tsx  # Central game canvas
├── left-sidebar.tsx    # Player stats and history
├── right-sidebar.tsx   # Betting controls and game info
├── bottom-tabs.tsx     # Game history and statistics
└── ui/                 # Reusable UI components

types/
└── game.ts            # TypeScript interfaces for game data

hooks/
├── use-game-state.ts  # Game state management
└── use-wallet.ts      # Wallet connection and management
```

### Architecture Benefits

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Layout components can be reused across different game modes
3. **Maintainability**: Easy to modify individual parts without affecting others
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Clean Data Flow**: Game state flows down through props, actions flow up through callbacks

### Component Responsibilities

- **GameLayout**: Handles background, container, and overall page structure
- **GameContent**: Manages the responsive grid layout for sidebars and main content
- **GameController**: Centralizes all game state and actions using render props pattern
- **Main Page**: Focuses only on composition and data flow

### State Management

The game uses a custom hook-based state management system:
- `useGameState`: Manages game mechanics, player stats, and game history
- `useWallet`: Handles wallet connection and blockchain interactions

### Responsive Design

The layout automatically adapts to different screen sizes:
- Mobile: Single column layout
- Desktop: 5-column grid (1-3-1) with sidebars and main game area

## Getting Started

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Connect wallet to start playing

## Features

- Real-time crash game mechanics
- Wallet integration
- Player statistics and history
- Responsive design
- Dark theme with animated backgrounds
- Token and point system 