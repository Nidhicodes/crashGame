"use client"

import { GameCanvas } from "@/components/game-canvas"
import { GameHistory } from "@/components/game-history"
import { GameStatus } from "@/components/game-status"
import { BettingControls } from "./betting-controls"
import { useGameState } from "@/hooks/use-game-state"

interface GameState {
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

interface GameResult {
  id: string
  multiplier: number
  timestamp: Date
  players: number
  jackpot?: boolean
}

interface MainGameAreaProps {
  gameState: GameState
  gameHistory: GameResult[]
}

export function MainGameArea({ gameState, gameHistory }: MainGameAreaProps) {
  const {  playerStats,placeBet,cashOut } = useGameState();
  const handleCashOut = () => {
    cashOut()
  }

  const handlePlaceBet = (amount: number) => {
    placeBet(amount)
  }
  return (
    <div className="h-full flex flex-col gap-6">
      {/* Game Canvas */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
        <GameCanvas
          multiplier={gameState.currentMultiplier}
          phase={gameState.phase}
          crashed={gameState.phase === "crashed"}
        />
      </div>
      
      {/* Game Status */}
      <div className="flex-shrink-0">
        <GameStatus gameState={gameState} />
      </div>
      
      {/* Game History */}
      <div className="flex-1">
        <GameHistory history={gameHistory} />
      </div>
      <div className="flex-1">
      <BettingControls
              gameState={gameState}
              playerStats={playerStats}
              onPlaceBet={handlePlaceBet}
              onCashOut={handleCashOut}
            />
      </div>
    </div>
  )
} 