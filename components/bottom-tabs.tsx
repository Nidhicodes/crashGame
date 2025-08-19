"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Scoreboard } from "@/components/scoreboard"
import { GameHistory } from "@/components/game-history"

interface GameResult {
  id: string
  multiplier: number
  timestamp: Date
  players: number
  jackpot?: boolean
}

interface BottomTabsProps {
  gameHistory: GameResult[]
}

export function BottomTabs({ gameHistory }: BottomTabsProps) {
  return (
    <div className="w-full">
      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="grid w-full grid-cols-1 bg-black/40 backdrop-blur-sm border border-purple-500/20 mb-6">
          {/* <TabsTrigger
            value="leaderboard"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            🏆 Leaderboard
          </TabsTrigger> */}
          <TabsTrigger value="recent" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-center">
            📊 Recent Games
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="w-full">
          <GameHistory history={gameHistory} detailed />
        </TabsContent>
      </Tabs>
    </div>
  )
} 