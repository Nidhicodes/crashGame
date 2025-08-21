"use client"

import { GameHistory } from "@/components/game-history"
import { IntegratedGameArena } from "./integrated-game-arena"
import { GameState, GameResult } from "@/types/game"

interface MainGameAreaProps {
  gameState: GameState
  gameHistory: GameResult[]
  playerStats: any
  onPlaceBet: (amount: number) => void
  onCashOut: () => void
}

export function MainGameArea({ 
  gameState, 
  gameHistory, 
  playerStats,
  onPlaceBet,
  onCashOut
}: MainGameAreaProps) {
  return (
    <div className="h-full flex flex-col gap-6">
      {/* Integrated Game Arena with Betting Controls */}
      <div className="flex-1">
        <IntegratedGameArena
          gameState={gameState}
          playerStats={playerStats}
          onPlaceBet={onPlaceBet}
          onCashOut={onCashOut}
        />
      </div>
      
      {/* Game History */}
      <div className="flex-1">
        <GameHistory history={gameHistory} />
      </div>
    </div>
  )
} 