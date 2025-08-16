"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Zap, Users, Copy, Gift, TrendingUp } from "lucide-react"
import { BettingControls } from "@/components/betting-controls"

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
    <div className="h-full flex flex-col">
      <Tabs defaultValue="balance" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 bg-black/40 backdrop-blur-sm border border-purple-500/20 ">
          <TabsTrigger 
            value="balance" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Coins className="w-4 h-4 mr-2" />
            Balance
          </TabsTrigger>
          <TabsTrigger 
            value="referrals" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Users className="w-4 h-4 mr-2" />
            Referrals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="flex-1 space-y-2">
          {/* Player Stats */}
          <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-200">
                <Coins className="w-6 h-6 text-purple-400" />
                Your Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

          {/* Betting Controls - Added to Balance Tab */}
          
        </TabsContent>

        <TabsContent value="referrals" className="flex-1 space-y-6">
          {/* Referral System */}
          <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-200">
                <Users className="w-6 h-6 text-purple-400" />
                Referral Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Your Referral Code */}
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

              {/* Referral Stats */}
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

              {/* Enter Referral Code */}
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

          {/* Betting Controls - Added to Referrals Tab */}
          <div className="flex-1">
            <BettingControls
              gameState={gameState}
              playerStats={playerStats}
              onPlaceBet={onPlaceBet}
              onCashOut={onCashOut}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 