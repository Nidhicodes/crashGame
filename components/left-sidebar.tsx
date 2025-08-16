"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trophy, History, TrendingUp, TrendingDown, ChevronDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  if (x >= 2)  return "text-green-400 border-green-400"
  return "text-red-400 border-red-400"
}

export function LeftSidebarTabs({
  playerStats,
  history,
}: {
  playerStats: PlayerStats
  history: RoundItem[]
}) {
  const [showAllRounds, setShowAllRounds] = useState(false)
  const last20 = (history ?? []).slice(0, 20)
  const displayedRounds = showAllRounds ? last20 : last20.slice(0, 10)
  const avg = last20.length
    ? (last20.reduce((s, g) => s + g.multiplier, 0) / last20.length).toFixed(2)
    : "0.00"
  const max = last20.length
    ? Math.max(...last20.map((g) => g.multiplier)).toFixed(2)
    : "0.00"

  return (
    <div className="h-auto flex flex-col">
      <Tabs defaultValue="stats" className="h-auto flex flex-col">
        <TabsList className="grid w-full grid-cols-2 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-1  flex-shrink-0">
          <TabsTrigger value="stats" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg">
            <Trophy className="w-4 h-4 mr-2" /> Your Stats
          </TabsTrigger>
          <TabsTrigger value="rounds" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg">
            <History className="w-4 h-4 mr-2" /> Last 20 Rounds
          </TabsTrigger>
        </TabsList>

        {/* Your Stats */}
        <TabsContent value="stats" className="flex-1 min-h-0">
          <Card className="h-auto bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/10">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-3 text-purple-200">
                <Trophy className="w-6 h-6 text-purple-400" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm h-auto">
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
        <TabsContent value="rounds" className="flex-1 min-h-0">
          <Card className="h-auto bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/10">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-3 text-purple-200">
                <History className="w-6 h-6 text-purple-400" />
                Last 20 Rounds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Rounds List with Scrollable Content */}
              <div className="space-y-2">
                {displayedRounds.length === 0 && (
                  <div className="text-sm text-purple-300">No rounds yet.</div>
                )}
                
                {!showAllRounds ? (
                  // Show first 10 rounds
                  displayedRounds.map((game, idx) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-2 bg-purple-900/20 rounded-lg border border-purple-500/20"
                    >
                      <span className="text-purple-300 text-sm">#{idx + 1}</span>
                      <Badge className={`${getMultiplierColor(game.multiplier)} bg-transparent border`}>
                        {game.multiplier.toFixed(2)}×
                      </Badge>
                    </div>
                  ))
                ) : (
                  // Show all rounds in scrollable area
                  <ScrollArea className="h-64 w-full rounded-md border border-purple-500/20">
                    <div className="space-y-2 p-2">
                      {displayedRounds.map((game, idx) => (
                        <div
                          key={game.id}
                          className="flex items-center justify-between p-2 bg-purple-900/20 rounded-lg border border-purple-500/20"
                        >
                          <span className="text-purple-300 text-sm">#{idx + 1}</span>
                          <Badge className={`${getMultiplierColor(game.multiplier)} bg-transparent border`}>
                            {game.multiplier.toFixed(2)}×
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>

              {/* Show More/Less Button */}
              {last20.length > 10 && (
                <div className="pt-2">
                  <Button
                    onClick={() => setShowAllRounds(!showAllRounds)}
                    variant="outline"
                    size="sm"
                    className="w-full bg-purple-900/20 border-purple-500/30 text-purple-300 hover:bg-purple-800/30 hover:border-purple-500/50"
                  >
                    {showAllRounds ? (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2 rotate-180" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Show More ({last20.length - 10} more)
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Summary Stats */}
              {last20.length > 0 && (
                <div className="pt-4 border-t border-purple-500/20">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 p-2 bg-purple-900/20 rounded border border-purple-500/20">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-purple-300">Avg: {avg}×</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-purple-900/20 rounded border border-purple-500/20">
                      <TrendingDown className="w-4 h-4 text-yellow-400" />
                      <span className="text-purple-300">Max: {max}×</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default LeftSidebarTabs
