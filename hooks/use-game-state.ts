"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "./use-wallet"

interface GameState {
  phase: "betting" | "flying" | "crashed"
  currentMultiplier: number
  timeLeft: number
  activePlayers: Array<{
    name: string
    bet: number
    targetMultiplier: number
  }>
  playerBet: number | null
}

interface PlayerStats {
  tokens: number
  points: number
  totalWon: number
  gamesPlayed: number
  winRate: number
  bestMultiplier: number
  rank: number
  faucetCooldown: number
}

interface GameResult {
  id: string
  multiplier: number
  timestamp: Date
  players: number
  jackpot?: boolean
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    phase: "betting",
    currentMultiplier: 1.0,
    timeLeft: 10,
    activePlayers: [],
    playerBet: null,
  })
  const {balance} = useWallet();

  
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    tokens: Number(balance) || 0,
    points: 0,
    totalWon: 0,
    gamesPlayed: 0,
    winRate: 0,
    bestMultiplier: 0,
    rank: 0,
    faucetCooldown: 0,
  })
  useEffect(() => {
    if (balance !== null) {
      setPlayerStats((prev) => ({
        ...prev,
        tokens: Number(balance),
      }))
    }
  }, [balance])

  const [gameHistory, setGameHistory] = useState<GameResult[]>([
    { id: "1", multiplier: 2.34, timestamp: new Date(Date.now() - 60000), players: 12 },
    { id: "2", multiplier: 1.23, timestamp: new Date(Date.now() - 120000), players: 8 },
    { id: "3", multiplier: 15.67, timestamp: new Date(Date.now() - 180000), players: 15, jackpot: true },
    { id: "4", multiplier: 3.45, timestamp: new Date(Date.now() - 240000), players: 10 },
    { id: "5", multiplier: 1.89, timestamp: new Date(Date.now() - 300000), players: 7 },
  ])

  // Generate random crash point
  const generateCrashPoint = useCallback(() => {
    // Weighted random for more realistic crash points
    const rand = Math.random()
    if (rand < 0.5) return 1 + Math.random() * 2 // 1-3x (50% chance)
    if (rand < 0.8) return 3 + Math.random() * 7 // 3-10x (30% chance)
    if (rand < 0.95) return 10 + Math.random() * 40 // 10-50x (15% chance)
    if (rand < 0.99) return 50 + Math.random() * 200 // 50-250x (4% chance)
    return 250 + Math.random() * 4750 // 250-5000x (1% chance)
  }, [])

  // Generate mock active players
  const generateActivePlayers = useCallback(() => {
    const playerNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry"]
    const count = Math.floor(Math.random() * 8) + 3
    return Array.from({ length: count }, (_, i) => ({
      name: playerNames[i] || `Player${i}`,
      bet: Math.floor(Math.random() * 200) + 10,
      targetMultiplier: 1 + Math.random() * 10,
    }))
  }, [])

  // Game loop
  useEffect(() => {
    let interval: NodeJS.Timeout
    let crashPoint = generateCrashPoint()

    const runGameLoop = () => {
      interval = setInterval(() => {
        setGameState((prev) => {
          if (prev.phase === "betting") {
            if (prev.timeLeft <= 1) {
              // Start flying phase
              return {
                ...prev,
                phase: "flying",
                currentMultiplier: 1.0,
                timeLeft: 0,
                activePlayers: generateActivePlayers(),
              }
            }
            return { ...prev, timeLeft: prev.timeLeft - 1 }
          }

          if (prev.phase === "flying") {
            const newMultiplier = prev.currentMultiplier + 0.01 + prev.currentMultiplier * 0.001

            if (newMultiplier >= crashPoint) {
              // Crash!
              const newResult: GameResult = {
                id: Date.now().toString(),
                multiplier: crashPoint,
                timestamp: new Date(),
                players: prev.activePlayers.length,
                jackpot: crashPoint >= 75,
              }

              setGameHistory((prevHistory) => [newResult, ...prevHistory])

              return {
                ...prev,
                phase: "crashed",
                currentMultiplier: crashPoint,
                timeLeft: 3,
              }
            }

            return { ...prev, currentMultiplier: newMultiplier }
          }

          if (prev.phase === "crashed") {
            if (prev.timeLeft <= 1) {
              // Reset for next round
              crashPoint = generateCrashPoint()
              return {
                phase: "betting",
                currentMultiplier: 1.0,
                timeLeft: 10,
                activePlayers: [],
                playerBet: null,
              }
            }
            return { ...prev, timeLeft: prev.timeLeft - 1 }
          }

          return prev
        })
      }, 100)
    }

    runGameLoop()

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [generateCrashPoint, generateActivePlayers])

  // Faucet cooldown
  useEffect(() => {
    if (playerStats.faucetCooldown > 0) {
      const timer = setTimeout(() => {
        setPlayerStats((prev) => ({ ...prev, faucetCooldown: prev.faucetCooldown - 1 }))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [playerStats.faucetCooldown])

  const placeBet = useCallback(
    (amount: number) => {
      if (gameState.phase === "betting" && amount <= playerStats.points) {
        setGameState((prev) => ({ ...prev, playerBet: amount }))
        setPlayerStats((prev) => ({ ...prev, points: prev.points - amount }))
      }
    },
    [gameState.phase, playerStats.points],
  )

  const cashOut = useCallback(() => {
    if (gameState.phase === "flying" && gameState.playerBet) {
      const winnings = gameState.playerBet * gameState.currentMultiplier
      setPlayerStats((prev) => ({
        ...prev,
        points: prev.points + winnings,
        totalWon: prev.totalWon + winnings,
        gamesPlayed: prev.gamesPlayed + 1,
        winRate: (((prev.gamesPlayed * prev.winRate) / 100 + 1) / (prev.gamesPlayed + 1)) * 100,
        bestMultiplier: Math.max(prev.bestMultiplier, gameState.currentMultiplier),
      }))
      setGameState((prev) => ({ ...prev, playerBet: null }))
    }
  }, [gameState.phase, gameState.playerBet, gameState.currentMultiplier])

 const claimFaucet = () => {
  if (playerStats.faucetCooldown > 0) return;
 window.open("https://faucet.quranium.org", "_blank", "noopener,noreferrer");;
};

  const convertTokensToPoints = useCallback(
    (amount: number) => {
      if (amount <= playerStats.tokens) {
        setPlayerStats((prev) => ({
          ...prev,
          tokens: prev.tokens - amount,
          points: prev.points + amount,
        }))
      }
    },
    [playerStats.tokens],
  )

  return {
    gameState,
    playerStats,
    gameHistory,
    placeBet,
    cashOut,
    claimFaucet,
    convertTokensToPoints,
  }
}
