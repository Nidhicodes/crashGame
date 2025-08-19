"use client"

import { useState } from "react"
import { GameCanvas } from "@/components/game-canvas"
import { GameStatus } from "@/components/game-status"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp } from "lucide-react"
import { GameState, PlayerStats } from "@/types/game"

interface IntegratedGameArenaProps {
  gameState: GameState
  playerStats: PlayerStats
  onPlaceBet: (amount: number) => void
  onCashOut: () => void
}

export function IntegratedGameArena({ 
  gameState, 
  playerStats, 
  onPlaceBet, 
  onCashOut 
}: IntegratedGameArenaProps) {
  const [betAmount, setBetAmount] = useState("")

  const handlePlaceBet = () => {
    const amount = Number.parseFloat(betAmount)
    if (amount > 0 && amount <= playerStats.points) {
      onPlaceBet(amount)
      setBetAmount("")
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/10">
        <CardHeader className="pb-1">
          <CardTitle className="text-purple-200 text-center text-xl">
            Crash Game Arena
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4 p-4">
          {/* Game Canvas - Takes up most available space */}
          <div className="flex-1 min-h-[280px] bg-black/60 rounded-lg border border-purple-500/30 overflow-hidden">
            <GameCanvas
              multiplier={gameState.currentMultiplier}
              phase={gameState.phase}
              crashed={gameState.phase === "crashed"}
              timeLeft={gameState.timeLeft}
            />
          </div>
          
          {/* Game Status - Compact display
          <div className="flex-shrink-0">
            <GameStatus gameState={gameState} />
          </div> */}
          
          {/* Betting Controls - Fixed height section */}
          <div className="flex-shrink-0 bg-purple-900/20 rounded-lg border border-purple-500/20 p-4">
            <div className="space-y-2">
              <div className="text-center">
                <h3 className="text-purple-200 font-semibold text-lg">Place Your Bet</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-200 block">
                  Bet Amount (Points)
                </label>
                <Input
                  type="number"
                  placeholder="Enter bet amount"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-black/40 border-purple-500/30 text-white placeholder-purple-400"
                  disabled={gameState.phase !== "betting"}
                />
              </div>

              {/* Quick bet buttons */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setBetAmount("10")}
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-900/40 bg-transparent"
                  size="sm"
                  disabled={gameState.phase !== "betting"}
                >
                  10
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setBetAmount("50")}
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-900/40 bg-transparent"
                  size="sm"
                  disabled={gameState.phase !== "betting"}
                >
                  50
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setBetAmount("100")}
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-900/40 bg-transparent"
                  size="sm"
                  disabled={gameState.phase !== "betting"}
                >
                  100
                </Button>
              </div>

              {/* Main action button */}
              <div className="space-y-3">
                {gameState.phase === "betting" ? (
                  <Button
                    onClick={handlePlaceBet}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/25 text-white font-semibold py-2.5"
                    disabled={!betAmount || Number.parseFloat(betAmount) > playerStats.points || Number.parseFloat(betAmount) <= 0}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Place Bet
                  </Button>
                ) : gameState.playerBet && gameState.phase === "flying" ? (
                  <Button
                    onClick={onCashOut}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 animate-pulse shadow-lg shadow-yellow-500/25 text-white font-semibold py-2.5"
                  >
                    💰 Cash Out ({(gameState.playerBet * gameState.currentMultiplier).toFixed(2)} pts)
                  </Button>
                ) : (
                  <Button 
                    disabled 
                    className="w-full bg-gray-600 text-gray-300 py-2.5"
                  >
                    {gameState.phase === "crashed"
                      ? "Round Crashed!"
                      : gameState.phase === "waiting"
                        ? `Next Round: ${gameState.timeLeft}s`
                        : "Waiting for next round..."}
                  </Button>
                )}

                {/* Current bet info */}
                {gameState.playerBet && (
                  <div className="text-sm text-center p-3 bg-purple-900/30 rounded-lg border border-purple-500/20">
                    <div className="flex justify-between items-center text-purple-200 mb-1">
                      <span>Your bet:</span>
                      <span className="font-bold">{gameState.playerBet} pts</span>
                    </div>
                    <div className="flex justify-between items-center text-green-400">
                      <span>Potential win:</span>
                      <span className="font-bold">
                        {(gameState.playerBet * gameState.currentMultiplier).toFixed(2)} pts
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}