"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Crown } from "lucide-react"

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

interface GameStatusProps {
  gameState: GameState
}

export function GameStatus({ gameState }: GameStatusProps) {
  const getGameStatusColor = () => {
    switch (gameState.phase) {
      case "betting":
        return "bg-blue-500 shadow-blue-500/50"
      case "flying":
        return "bg-green-500 shadow-green-500/50"
      case "crashed":
        return "bg-red-500 shadow-red-500/50"
      case "waiting":
        return "bg-yellow-500 shadow-yellow-500/50"
      default:
        return "bg-purple-500 shadow-purple-500/50"
    }
  }

  const getJackpotBadge = (multiplier: number) => {
    if (multiplier >= 5000) return { text: "MEGA JACKPOT!", color: "bg-purple-600" }
    if (multiplier >= 1250) return { text: "SUPER JACKPOT!", color: "bg-yellow-500" }
    if (multiplier >= 75) return { text: "JACKPOT!", color: "bg-orange-500" }
    return null
  }

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-2xl shadow-purple-500/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${getGameStatusColor()} shadow-lg animate-pulse`}></div>
            <span className="font-semibold capitalize text-lg text-purple-200">{gameState.phase}</span>
            {gameState.phase === "flying" && (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 animate-pulse">
                <TrendingUp className="w-3 h-3 mr-1" />
                LIVE
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
              {gameState.currentMultiplier.toFixed(2)}×
            </div>
            <div className="text-sm text-purple-300">
              {gameState.phase === "betting" && `Place your bets: ${gameState.timeLeft}s`}
              {gameState.phase === "waiting" && `Next round starts in ${gameState.timeLeft}s`}
              {gameState.phase === "crashed" && `Round ended...`}
            </div>
          </div>
        </div>

        {/* Enhanced Jackpot Badge */}
        {(() => {
          const jackpot = getJackpotBadge(gameState.currentMultiplier)
          return (
            jackpot && (
              <div className="mb-6 text-center">
                <Badge className={`${jackpot.color} text-white animate-bounce text-lg px-4 py-2 shadow-lg`}>
                  <Crown className="w-5 h-5 mr-2" />
                  {jackpot.text}
                </Badge>
              </div>
            )
          )
        })()}

        {/* Enhanced Active Players */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-lg font-medium text-purple-200">
              Active Players ({gameState.activePlayers.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {gameState.activePlayers.slice(0, 10).map((player, index) => (
              <Badge
                key={index}
                className="bg-purple-900/40 text-purple-200 border-purple-500/30 backdrop-blur-sm"
              >
                {player.name}: {player.bet} pts @ {player.targetMultiplier}×
              </Badge>
            ))}
            {gameState.activePlayers.length > 10 && (
              <Badge className="bg-purple-800/40 text-purple-300 border-purple-500/30">
                +{gameState.activePlayers.length - 10} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 