"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Crown } from "lucide-react"

interface Player {
  id: string
  name: string
  totalWon: number
  gamesPlayed: number
  winRate: number
  bestMultiplier: number
  rank: number
}

const mockPlayers: Player[] = [
  { id: "1", name: "CryptoKing", totalWon: 15420, gamesPlayed: 234, winRate: 67.5, bestMultiplier: 127.3, rank: 1 },
  { id: "2", name: "RocketMaster", totalWon: 12890, gamesPlayed: 189, winRate: 71.2, bestMultiplier: 89.7, rank: 2 },
  { id: "3", name: "MoonShot", totalWon: 11250, gamesPlayed: 156, winRate: 69.8, bestMultiplier: 156.4, rank: 3 },
  { id: "4", name: "DiamondHands", totalWon: 9870, gamesPlayed: 201, winRate: 58.3, bestMultiplier: 78.9, rank: 4 },
  { id: "5", name: "QuraniumPro", totalWon: 8640, gamesPlayed: 143, winRate: 72.1, bestMultiplier: 234.5, rank: 5 },
  { id: "6", name: "CrashExpert", totalWon: 7890, gamesPlayed: 167, winRate: 64.7, bestMultiplier: 45.6, rank: 6 },
  { id: "7", name: "TestNetHero", totalWon: 7120, gamesPlayed: 134, winRate: 66.4, bestMultiplier: 67.8, rank: 7 },
  { id: "8", name: "GamingLegend", totalWon: 6540, gamesPlayed: 178, winRate: 61.2, bestMultiplier: 123.4, rank: 8 },
]

export function Scoreboard() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />
      default:
        return <Award className="w-5 h-5 text-slate-400" />
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500"
      case 2:
        return "bg-gray-400"
      case 3:
        return "bg-amber-600"
      default:
        return "bg-slate-600"
    }
  }

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-2xl shadow-purple-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-purple-200">
          <Trophy className="w-6 h-6 text-purple-400" />
          Leaderboard
          <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockPlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-900/20 to-black/20 rounded-lg hover:from-purple-900/30 hover:to-black/30 transition-all duration-300 border border-purple-500/20"
            >
              <div className="flex items-center gap-4">
                <Badge className={`${getRankBadge(player.rank)} text-white min-w-[2.5rem] justify-center shadow-lg`}>
                  #{player.rank}
                </Badge>
                {getRankIcon(player.rank)}
                <div>
                  <div className="font-semibold text-white text-lg">{player.name}</div>
                  <div className="text-sm text-purple-300">
                    {player.gamesPlayed} games • {player.winRate}% win rate
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-green-400 text-xl">{player.totalWon.toLocaleString()} pts</div>
                <div className="text-sm text-yellow-400">Best: {player.bestMultiplier}×</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-black/30 rounded-lg text-center text-sm text-purple-300 border border-purple-500/20">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Rankings update every 5 minutes
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
