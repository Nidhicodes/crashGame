"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Crown } from "lucide-react"
import { getLeaderboard } from "@/lib/api"

interface Player {
  id: string
  name: string
  totalWon: number
  gamesPlayed: number
  winRate: number
  bestMultiplier: number
  rank: number
}

export function Scoreboard() {
  const [players, setPlayers] = useState<Player[]>([])
  const [leaderboardType, setLeaderboardType] = useState("all-time")

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard(leaderboardType)
      setPlayers(data.entries)
    }
    fetchLeaderboard()
  }, [leaderboardType])

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
        <CardTitle className="flex items-center justify-between text-purple-200">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-purple-400" />
            Leaderboard
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">Live</Badge>
          </div>
          <div>
            <select
              value={leaderboardType}
              onChange={(e) => setLeaderboardType(e.target.value)}
              className="bg-purple-900/40 border-purple-500/30 text-white rounded-md px-2 py-1"
            >
              <option value="all-time">All Time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {players.map((player) => (
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
