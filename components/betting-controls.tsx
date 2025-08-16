"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp } from "lucide-react"

interface GameState {
  phase: "betting" | "flying" | "crashed" | "waiting"
  playerBet: number | null
  currentMultiplier: number
  timeLeft: number
}

interface PlayerStats {
  points: number
}

interface BettingControlsProps {
  gameState: GameState
  playerStats: PlayerStats
  onPlaceBet: (amount: number) => void
  onCashOut: () => void
}

export function BettingControls({ gameState, playerStats, onPlaceBet, onCashOut }: BettingControlsProps) {
  const [betAmount, setBetAmount] = useState("")

  const handlePlaceBet = () => {
    const amount = Number.parseFloat(betAmount)
    if (amount > 0 && amount <= playerStats.points) {
      onPlaceBet(amount)
      setBetAmount("")
    }
  }

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/10">
      <CardHeader>
        <CardTitle className="text-purple-200">Place Bet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <label className="text-sm font-medium text-purple-200">Bet Amount (Points)</label>
          <Input
            type="number"
            placeholder="Enter bet amount"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="bg-black/40 border-purple-500/30 text-white placeholder-purple-400"
            disabled={gameState.phase !== "betting"}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => setBetAmount("10")}
            className="border-purple-500/30 text-purple-300 hover:bg-purple-900/40"
          >
            10
          </Button>
          <Button
            onClick={() => setBetAmount("50")}
            className="border-purple-500/30 text-purple-300 hover:bg-purple-900/40"
          >
            50
          </Button>
          <Button
            onClick={() => setBetAmount("100")}
            className="border-purple-500/30 text-purple-300 hover:bg-purple-900/40"
          >
            100
          </Button>
        </div>

        {gameState.phase === "betting" ? (
          <Button
            onClick={handlePlaceBet}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/25"
            disabled={!betAmount || Number.parseFloat(betAmount) > playerStats.points}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Place Bet
          </Button>
        ) : gameState.playerBet && gameState.phase === "flying" ? (
          <Button
            onClick={onCashOut}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 animate-pulse shadow-lg shadow-yellow-500/25"
          >
            💰 Cash Out ({(gameState.playerBet * gameState.currentMultiplier).toFixed(2)} pts)
          </Button>
        ) : (
          <Button disabled className="w-full bg-gray-600">
            {gameState.phase === "crashed"
              ? "Round Crashed!"
              : gameState.phase === "waiting"
                ? `Get ready: ${gameState.timeLeft}s`
                : "Waiting for the next round..."}
          </Button>
        )}

        {gameState.playerBet && (
          <div className="text-sm text-center p-3 bg-purple-900/30 rounded-lg border border-purple-500/20">
            <div className="text-purple-200">
              Your bet: <span className="font-bold">{gameState.playerBet} pts</span>
            </div>
            <div className="text-green-400">
              Potential win:{" "}
              <span className="font-bold">
                {(gameState.playerBet * gameState.currentMultiplier).toFixed(2)} pts
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 