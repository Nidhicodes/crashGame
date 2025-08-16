"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trophy, History, TrendingUp, TrendingDown } from "lucide-react"

export type PlayerStats = {
  gamesPlayed: number
  winRate: number      // 0..100
  bestMultiplier: number
  rank: number
}

export type RoundItem = {
  id: string | number
  multiplier: number
}

function getMultiplierColor(x: number) {
  if (x >= 10) return "text-green-400 border-green-400"
  if (x >= 2)  return "text-blue-400 border-blue-400"
  return "text-red-400 border-red-400"
}

export function LeftSidebarTabs({
  playerStats,
  history,
}: {
  playerStats: PlayerStats
  history: RoundItem[]
}) {
  const last20 = (history ?? []).slice(0, 20)
  const avg = last20.length
    ? (last20.reduce((s, g) => s + g.multiplier, 0) / last20.length).toFixed(2)
    : "0.00"
  const max = last20.length
    ? Math.max(...last20.map((g) => g.multiplier)).toFixed(2)
    : "0.00"

  return (
    <Tabs defaultValue="stats" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-1">
        <TabsTrigger value="stats" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg">
          <Trophy className="w-4 h-4 mr-2" /> Your Stats
        </TabsTrigger>
        <TabsTrigger value="rounds" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg">
          <History className="w-4 h-4 mr-2" /> Last 20 Rounds
        </TabsTrigger>
      </TabsList>

      {/* Your Stats */}
      <TabsContent value="stats">
        <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-purple-200">
              <Trophy className="w-6 h-6 text-purple-400" />
              Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-2 bg-purple-900/20 rounded border border-purple-500/20">
              <span className="text-purple-300">Games Played:</span>
              <span className="font-bold text-white">{playerStats.gamesPlayed}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-purple-900/20 rounded border border-purple-500/20">
              <span className="text-purple-300">Win Rate:</span>
              <span className="font-bold text-green-400">{playerStats.winRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-purple-900/20 rounded border border-purple-500/20">
              <span className="text-purple-300">Best Multiplier:</span>
              <span className="font-bold text-yellow-400">{playerStats.bestMultiplier.toFixed(2)}×</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-purple-900/20 rounded border border-purple-500/20">
              <span className="text-purple-300">Rank:</span>
              <span className="font-bold text-purple-400">#{playerStats.rank}</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Last 20 Rounds — column list */}
      <TabsContent value="rounds">
        <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-purple-200">
              <History className="w-6 h-6 text-purple-400" />
              Last 20 Rounds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {last20.length === 0 && (
                <div className="text-sm text-purple-300">No rounds yet.</div>
              )}
              {last20.map((game, idx) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-2 bg-purple-900/20 rounded-lg border border-purple-500/20"
                >
                  <div className="text-xs text-purple-400">#{idx + 1}</div>
                  <Badge className={`${getMultiplierColor(game.multiplier)} bg-purple-900/20 border-current backdrop-blur-sm`}>
                    {game.multiplier.toFixed(2)}×
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-purple-300 p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span>Avg: {avg}×</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-yellow-400" />
                <span>Max: {max}×</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default LeftSidebarTabs
