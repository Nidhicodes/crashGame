"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Rocket, TrendingUp, Trophy, Coins, Zap, Crown, Users, Copy, Gift, ExternalLink } from "lucide-react"
import { GameCanvas } from "@/components/game-canvas"
import { Scoreboard } from "@/components/scoreboard"
import { GameHistory } from "@/components/game-history"
import { useGameState } from "@/hooks/use-game-state"
import { useWallet } from "@/hooks/use-wallet"

export default function CrashGame() {
  const { gameState, playerStats, gameHistory, placeBet, cashOut, claimFaucet, convertTokensToPoints } = useGameState()

  const { wallet, connectWallet, isConnected } = useWallet()
  const [betAmount, setBetAmount] = useState("")
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

  const handlePlaceBet = () => {
    const amount = Number.parseFloat(betAmount)
    if (amount > 0 && amount <= playerStats.points) {
      placeBet(amount)
      setBetAmount("")
    }
  }

  const handleCashOut = () => {
    cashOut()
  }

  const handleClaimFaucet = () => {
    claimFaucet()
  }

  const handleConvertTokens = () => {
    const amount = Number.parseFloat(convertAmount)
    if (amount > 0 && amount <= playerStats.tokens) {
      convertTokensToPoints(amount)
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
      // Simulate applying referral code
      setReferralStats(prev => ({
        ...prev,
        hasUsedReferralCode: true
      }))
      setEnteredReferralCode("")
      // You would typically call an API here to apply the referral code
    }
  }

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
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative p-3 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg shadow-purple-500/25">
              <Rocket className="h-8 w-8 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                Quantum Crash
              </h1>
              <p className="text-sm text-purple-300">TestNet Demo Game • Live Now</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isConnected ? (
              <Button
                onClick={connectWallet}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/25 border border-purple-500/20"
              >
                <Zap className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono">
                  {wallet?.address?.slice(0, 6)}...{wallet?.address?.slice(-4)}
                </span>
                <span className="text-sm text-blue-400 font-semibold">
                  {Number(wallet?.balance).toFixed(6)} QRN
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Main Game Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Enhanced Game Status */}
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

                {/* Game Canvas */}
                <GameCanvas
                  multiplier={gameState.currentMultiplier}
                  phase={gameState.phase}
                  crashed={gameState.phase === "crashed"}
                />

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

            {/* Enhanced Game History */}
            <GameHistory history={gameHistory} />
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Player Stats */}
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

                {/* Enhanced Faucet */}
                <div className="pt-4 border-t border-purple-500/20">
                  <Button
                    onClick={handleClaimFaucet}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 border border-blue-500/20"
                    disabled={playerStats.faucetCooldown > 0}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {playerStats.faucetCooldown > 0
                      ? `Faucet (${playerStats.faucetCooldown}s)`
                      : "Claim Faucet (100 tokens)"}
                  </Button>
                </div>

                {/* Enhanced Convert Tokens */}
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

            {/* Referral System Card */}
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

            {/* Enhanced Betting Controls */}
            <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/10">
              <CardHeader>
                <CardTitle className="text-purple-200">Place Bet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-purple-200">Bet Amount (Points)</label>
                  <Input
                    type="number"
                    placeholder="Enter bet amount"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="bg-black/40 border-purple-500/30 text-white placeholder-purple-400"
                    disabled={gameState.phase !== "betting"}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => setBetAmount("10")}
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-900/40"
                  >
                    10
                  </Button>
                  <Button
                    onClick={() => setBetAmount("50")}
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-900/40"
                  >
                    50
                  </Button>
                  <Button
                    onClick={() => setBetAmount("100")}
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-900/40"
                  >
                    100
                  </Button>
                </div>

                {gameState.phase === "betting" ? (
                  <Button
                    onClick={handlePlaceBet}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/25"
                    disabled={!betAmount || Number.parseFloat(betAmount) > playerStats.points}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Place Bet
                  </Button>
                ) : gameState.playerBet && gameState.phase === "flying" ? (
                  <Button
                    onClick={handleCashOut}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 animate-pulse shadow-lg shadow-yellow-500/25"
                  >
                    💰 Cash Out ({(gameState.playerBet * gameState.currentMultiplier).toFixed(2)} pts)
                  </Button>
                ) : (
                  <Button disabled className="w-full bg-gray-600">
                    {gameState.phase === "crashed"
                      ? "Round Crashed!"
                      : gameState.phase === "waiting"
                        ? `Get ready: ${gameState.timeLeft}s`
                        : "Waiting for the next round..."}
                  </Button>
                )}

                {gameState.playerBet && (
                  <div className="text-sm text-center p-3 bg-purple-900/30 rounded-lg border border-purple-500/20">
                    <div className="text-purple-200">
                      Your bet: <span className="font-bold">{gameState.playerBet} pts</span>
                    </div>
                    <div className="text-green-400">
                      Potential win:{" "}
                      <span className="font-bold">
                        {(gameState.playerBet * gameState.currentMultiplier).toFixed(2)} pts
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Quick Stats */}
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
          </div>
        </div>

        {/* Enhanced Bottom Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="leaderboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/40 backdrop-blur-sm border border-purple-500/20">
              <TabsTrigger
                value="leaderboard"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                🏆 Leaderboard
              </TabsTrigger>
              <TabsTrigger value="recent" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                📊 Recent Games
              </TabsTrigger>
            </TabsList>
            <TabsContent value="leaderboard">
              <Scoreboard />
            </TabsContent>
            <TabsContent value="recent">
              <GameHistory history={gameHistory} detailed />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}