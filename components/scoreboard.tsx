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
   <div className="flex flex-col justify-between h-full">
  {/* Header */}
  <div className="flex items-center justify-between text-purple-200 mb-4">
    <div className="flex items-center gap-2">
      {/* <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-glow animate-bounce-slow" /> */}
      <Badge className="bg-gradient-to-r from-purple-700/60 to-purple-500/60 text-purple-100 border border-purple-400/60 rounded-full px-3 py-1 shadow-lg shadow-purple-900/50 font-medium tracking-wide">
  Live
</Badge>

    </div>

    <select
      value={leaderboardType}
      onChange={(e) => setLeaderboardType(e.target.value)}
      className="bg-purple-900/40 border border-purple-500/40 text-purple-200 rounded-full px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-purple-500 transition"
    >
      <option value="all-time">🏅 All Time</option>
      <option value="daily">⚡ Daily</option>
      <option value="weekly">📅 Weekly</option>
    </select>
  </div>

  {/* Player List */}
  <div className="space-y-3 flex-1 overflow-y-auto pr-1">
    {players.map((player) => (
      <div
        key={player.id}
        className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-md rounded-xl border border-purple-500/20 
                   hover:scale-[1.02] hover:border-purple-400/40 transition-all duration-300 shadow-lg shadow-black/40"
      >
        <div className="flex items-center gap-4">
          <Badge className={`${getRankBadge(player.rank)} text-white min-w-[2.5rem] justify-center shadow-md`}>
            #{player.rank}
          </Badge>
          {getRankIcon(player.rank)}
          <div>
            <div className="font-semibold text-white text-lg tracking-wide">{player.name}</div>
            <div className="text-xs text-purple-300/80">
              🎮 {player.gamesPlayed} games • 🏆 {player.winRate}% win rate
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="font-bold text-green-400 text-xl drop-shadow-sm">
            {player.totalWon.toLocaleString()} pts
          </div>
          <div className="text-xs text-yellow-400 font-medium">
            🔥 Best: {player.bestMultiplier}×
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Footer */}
  <div className="mt-4 p-4 bg-gradient-to-r from-purple-900/30 to-black/40 rounded-xl text-center text-sm text-purple-300 border border-purple-500/20 shadow-inner">
    <div className="flex items-center justify-center gap-2">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      <span className="italic">Rankings refresh every 5 minutes</span>
    </div>
  </div>
</div>
  )
}
