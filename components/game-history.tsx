"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, TrendingUp, TrendingDown } from "lucide-react"

interface GameResult {
  id: string
  multiplier: number
  timestamp: Date
  players: number
  jackpot?: boolean
}

interface GameHistoryProps {
  history: GameResult[]
  detailed?: boolean
}

export function GameHistory({ history, detailed = false }: GameHistoryProps) {
  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= 10) return "text-purple-400"
    if (multiplier >= 5) return "text-yellow-400"
    if (multiplier >= 2) return "text-green-400"
    return "text-red-400"
  }

  const getMultiplierBadge = (multiplier: number) => {
    if (multiplier >= 100) return { text: "MEGA", color: "bg-purple-600" }
    if (multiplier >= 50) return { text: "SUPER", color: "bg-yellow-500" }
    if (multiplier >= 10) return { text: "HIGH", color: "bg-orange-500" }
    if (multiplier >= 2) return { text: "GOOD", color: "bg-green-500" }
    return { text: "LOW", color: "bg-red-500" }
  }

  if (detailed) {
    return (
      <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-2xl shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-purple-200">
            <History className="w-6 h-6 text-purple-400" />
            Recent Games
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">Live</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {history.slice(0, 20).map((game) => {
              const badge = getMultiplierBadge(game.multiplier)
              return (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-900/20 to-black/20 rounded-lg border border-purple-500/20 hover:from-purple-900/30 hover:to-black/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <Badge className={`${badge.color} text-white shadow-lg`}>{badge.text}</Badge>
                    <div>
                      <div className={`font-bold text-2xl ${getMultiplierColor(game.multiplier)}`}>
                        {game.multiplier.toFixed(2)}×
                      </div>
                      <div className="text-sm text-purple-300">{game.players} players</div>
                    </div>
                    {game.jackpot && (
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 animate-pulse">
                        🎉 JACKPOT
                      </Badge>
                    )}
                  </div>

                  <div className="text-right text-sm text-purple-400">{game.timestamp.toLocaleTimeString()}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-purple-200">
          <History className="w-6 h-6 text-purple-400" />
          Last 10 Rounds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {history.slice(0, 10).map((game) => (
            <Badge
              key={game.id}
              className={`${getMultiplierColor(game.multiplier)} bg-purple-900/20 border-current backdrop-blur-sm hover:bg-purple-900/40 transition-colors`}
            >
              {game.multiplier.toFixed(2)}×
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-purple-300 p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span>
              Avg:{" "}
              {(
                history.slice(0, 10).reduce((sum, game) => sum + game.multiplier, 0) / Math.min(10, history.length)
              ).toFixed(2)}
              ×
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-yellow-400" />
            <span>Max: {Math.max(...history.slice(0, 10).map((g) => g.multiplier)).toFixed(2)}×</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
