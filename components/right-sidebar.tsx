"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Zap, Users, Copy, Gift, TrendingUp, UserCheck, ChevronDown, Medal } from "lucide-react"
import { Scoreboard } from "@/components/scoreboard"


interface PlayerStats {
  tokens: number
  points: number
  totalWon: number
  faucetCooldown: number
}

interface GameState {
  phase: "betting" | "flying" | "crashed" | "waiting"
  playerBet: number | null
  currentMultiplier: number
  timeLeft: number
  activePlayers: Array<{
    name: string
    bet: number
    targetMultiplier: number
  }>
}

interface RightSidebarProps {
  playerStats: PlayerStats
  gameState: GameState
  onConvertTokens: (amount: number) => void
  onPlaceBet: (amount: number) => void
  onCashOut: () => void
}

export function RightSidebar({ playerStats, gameState, onConvertTokens, onPlaceBet, onCashOut }: RightSidebarProps) {
  const [convertAmount, setConvertAmount] = useState("")
  const [showAllPlayers, setShowAllPlayers] = useState(false)
  
  // Referral system state
  const [referralCode] = useState(`QRN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`)
  const [enteredReferralCode, setEnteredReferralCode] = useState("")
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 3,
    bonusPointsEarned: 150,
    bonusFaucetTokens: 75,
    hasUsedReferralCode: false
  })
  const [copySuccess, setCopySuccess] = useState(false)

  const activePlayers = gameState.activePlayers
  const displayedPlayers = showAllPlayers ? activePlayers : activePlayers.slice(0, 5)

  const handleConvertTokens = () => {
    const amount = Number.parseFloat(convertAmount)
    if (amount > 0 && amount <= playerStats.tokens) {
      onConvertTokens(amount)
      setConvertAmount("")
    }
  }

  const handleCopyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy referral code:', err)
    }
  }

  const handleApplyReferralCode = () => {
    if (enteredReferralCode.trim() && !referralStats.hasUsedReferralCode) {
      setReferralStats(prev => ({
        ...prev,
        hasUsedReferralCode: true
      }))
      setEnteredReferralCode("")
    }
  }

  return (
    <div className="h-96 flex flex-col">
      <Tabs defaultValue="balance" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-black/40 backdrop-blur-sm border border-purple-500/20 flex-shrink-0 p-0 g-1 rounded-xl ">
          <TabsTrigger 
            value="balance" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg"
          >
            Balance
          </TabsTrigger>

          <TabsTrigger 
            value="leaderboard" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg"
          >
           Leaderboard
          </TabsTrigger>

          <TabsTrigger 
            value="players" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg"
          >
            Players
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="flex-1 min-h-0 space-y-6">
          {/* Player Stats */}
          <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/10 md:h-[40.625rem] h-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-200">
                <Coins className="w-6 h-6 text-purple-400" />
                Your Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 h-[475px]">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                  <span className="text-purple-300">Tokens:</span>
                  <span className="font-bold text-xl text-blue-400">{playerStats.tokens.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                  <span className="text-purple-300">Points:</span>
                  <span className="font-bold text-xl text-green-400">{playerStats.points.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                  <span className="text-purple-300">Total Won:</span>
                  <span className="font-bold text-xl text-yellow-400">{playerStats.totalWon.toFixed(2)}</span>
                </div>
              </div>

              {/* Faucet */}
              <div className="pt-4 border-t border-purple-500/20">
                <a
                  href="https://faucet.quranium.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 border border-blue-500/20">
                    <Zap className="w-4 h-4 mr-2" />
                    {playerStats.faucetCooldown > 0
                      ? `Faucet (${playerStats.faucetCooldown}s)`
                      : "Claim Faucet"}
                  </Button>
                </a>
              </div>

              {/* Convert Tokens */}
              <div className="space-y-3 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                <label className="text-sm font-medium text-purple-200">Convert Tokens to Points</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={convertAmount}
                    onChange={(e) => setConvertAmount(e.target.value)}
                    className="bg-black/40 border-purple-500/30 text-white placeholder-purple-400"
                  />
                  <Button
                    onClick={handleConvertTokens}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  >
                    Convert
                  </Button>
                </div>
                <p className="text-xs text-purple-400">Rate: 1 token = 1 point</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/*
        <TabsContent value="referrals" className="flex-1 min-h-0 space-y-6">
          // Referral System //////////////////
          <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-200">
                <Users className="w-6 h-6 text-purple-400" />
                Referral Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 h-[475px]">

              //////Your Referral Code //////////////
              <div className="space-y-3">
                <label className="text-sm font-medium text-purple-200">Your Referral Code</label>
                <div className="flex gap-2">
                  <Input
                    value={referralCode}
                    readOnly
                    className="bg-black/40 border-purple-500/30 text-white font-mono"
                  />
                  <Button
                    onClick={handleCopyReferralCode}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-3"
                  >
                    {copySuccess ? (
                      <span className="text-green-400">✓</span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-purple-400">Share this code to earn 50 points per referral!</p>
              </div>

              ///////////// Referral Stats/////////////////// 
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-purple-900/20 rounded border border-purple-500/20">
                  <span className="text-purple-300 text-sm">Total Referrals:</span>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {referralStats.totalReferrals}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-900/20 rounded border border-purple-500/20">
                  <span className="text-purple-300 text-sm">Bonus Points:</span>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    {referralStats.bonusPointsEarned}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-900/20 rounded border border-purple-500/20">
                  <span className="text-purple-300 text-sm">Bonus Tokens:</span>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    {referralStats.bonusFaucetTokens}
                  </Badge>
                </div>
              </div>

              ////////// Enter Referral Code ////////////////////////////////
              {!referralStats.hasUsedReferralCode && (
                <div className="pt-4 border-t border-purple-500/20 space-y-3">
                  <label className="text-sm font-medium text-purple-200">Have a referral code?</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter code"
                      value={enteredReferralCode}
                      onChange={(e) => setEnteredReferralCode(e.target.value.toUpperCase())}
                      className="bg-black/40 border-purple-500/30 text-white placeholder-purple-400 font-mono"
                    />
                    <Button
                      onClick={handleApplyReferralCode}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      disabled={!enteredReferralCode.trim()}
                    >
                      <Gift className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-purple-400">Get bonus tokens when you enter a friend's code!</p>
                </div>
              )}

              {referralStats.hasUsedReferralCode && (
                <div className="pt-4 border-t border-purple-500/20">
                  <div className="flex items-center gap-2 p-3 bg-green-900/20 rounded-lg border border-green-500/20">
                    <Gift className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-300">Referral code applied! Bonus tokens unlocked.</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      */}

      <TabsContent value="leaderboard" className="flex-1 min-h-0 space-y-6">
  <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/10 md:h-[40.625rem] h-auto">
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-purple-200">
         {/* <Medal className="w-2 h-2 mr-2 text-black-300" /> */}
        🏆 Leaderboard
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 h-[475px] overflow-y-auto">
      <div className="h-full">
        <Scoreboard />
      </div>
    </CardContent>
  </Card>
</TabsContent>



        <TabsContent value="players" className="flex-1 min-h-0 space-y-6">
      {/* Active Players */}
      <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/10 md:h-[40.625rem] h-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-purple-200">
            <UserCheck className="w-6 h-6 text-purple-400" />
            Active Players ({activePlayers?.length ?? 0})
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 h-[475px]">
          {(!activePlayers || activePlayers.length === 0) ? (
            <div className="text-center py-8">
              <div className="text-purple-300 text-lg mb-2">No Active Players</div>
              <div className="text-purple-400 text-sm">Be the first to place a bet!</div>
            </div>
          ) : (
            <>
              {/* Single scroll container: collapsed => limited height, expanded => larger height */}
              <div
                className={`
                  relative transition-all duration-300 ease-in-out
                  overflow-hidden
                  ${showAllPlayers ? 'max-h-[420px]' : 'max-h-64'}
                `}
              >
                {/* Scroll area: always present, will be scrollable when content exceeds max-h */}
                <div
                  className="h-full overflow-y-auto p-1 space-y-3 scrollbar-none hover:scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple-500/30"
                  style={{
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                  }}
                >
                  <style jsx>{`
                    /* hide webkit scrollbar while still allowing scroll */
                    .scrollbar-none::-webkit-scrollbar { display: none; }
                  `}</style>

                  {/* Render collapsed list (first 5) or full list depending on state */}
                  {(showAllPlayers ? activePlayers : displayedPlayers).map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg border border-purple-500/20 transform transition-all duration-300 opacity-100"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {player.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white font-medium">{player.name}</div>
                          <div className="text-purple-300 text-xs">Target: {player.targetMultiplier.toFixed(2)}×</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-green-400 font-bold">{player.bet} pts</div>
                        <div className="text-purple-300 text-xs">
                          Win: {(player.bet * (gameState?.currentMultiplier ?? 1)).toFixed(1)} pts
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Show More/Less Button */}
              {activePlayers.length > 5 && (
                <div className="pt-2">
                  <Button
                    onClick={() => setShowAllPlayers(prev => !prev)}
                    variant="outline"
                    size="sm"
                    className="w-full bg-purple-900/20 border-purple-500/30 text-purple-300 hover:bg-purple-800/30 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center">
                      <ChevronDown
                        className={`w-4 h-4 mr-2 transition-transform duration-300 ease-in-out ${showAllPlayers ? 'rotate-180' : ''}`}
                      />
                      {showAllPlayers ? 'Show Less' : `Show All ${activePlayers.length} Players`}
                    </div>
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </TabsContent>
      </Tabs>
    </div>
  )
}

// Demo component with sample data
export default function Demo() {
  const samplePlayerStats = {
    tokens: 125.45,
    points: 89.32,
    totalWon: 432.12,
    faucetCooldown: 0
  }

  const sampleGameState = {
    phase: "betting" as const,
    playerBet: null,
    currentMultiplier: 1.25,
    timeLeft: 30,
    activePlayers: Array.from({ length: 12 }, (_, i) => ({
      name: `Player${i + 1}`,
      bet: Math.floor(Math.random() * 100) + 10,
      targetMultiplier: Math.round((Math.random() * 10 + 1) * 100) / 100
    }))
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4">
      <div className="h-full max-w-sm">
        <RightSidebar 
          playerStats={samplePlayerStats} 
          gameState={sampleGameState}
          onConvertTokens={(amount) => console.log('Convert:', amount)}
          onPlaceBet={(amount) => console.log('Bet:', amount)}
          onCashOut={() => console.log('Cash out')}
        />
      </div>
    </div>
  )
}