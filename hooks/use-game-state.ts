"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "./use-wallet"
import { getProfile } from "@/lib/indexedDb"
import { getUser, getGameHistory as getHistory, saveGameResult, updateUser } from "@/lib/api"

interface GameState {
  phase: "betting" | "flying" | "crashed" | "waiting"
  currentMultiplier: number
  timeLeft: number
  activePlayers: Array<{
    name: string
    bet: number
    targetMultiplier: number
  }>
  playerBet: number | null
  crashPoint?: number // Store the crash point for display
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
    phase: "waiting", // Start with waiting phase instead of betting
    currentMultiplier: 1.0,
    timeLeft: 5, // 5 second wait before first round
    activePlayers: [],
    playerBet: null,
  })
  const { balance, wallet } = useWallet()

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    tokens: Number(balance) || 0,
    points: 100, // Give some starting points for testing
    totalWon: 0,
    gamesPlayed: 0,
    winRate: 0,
    bestMultiplier: 0,
    rank: 0,
    faucetCooldown: 0,
  })

  const [userExists, setUserExists] = useState(false)

  useEffect(() => {
    if (balance !== null) {
      setPlayerStats((prev) => ({
        ...prev,
        tokens: Number(balance),
      }))
    }
  }, [balance])

  useEffect(() => {
    async function ensureUserExists() {
      if (!wallet?.address) {
        setUserExists(false)
        return
      }

      try {
        console.log('🔍 Checking if user exists:', wallet.address)
        
        // Try to get the user first
        let user = await getUser(wallet.address)
        console.log('👤 User found:', user)

        if (!user) {
          console.log('🆕 Creating new user...')
          
          // Create the user with proper payload
          const createPayload = {
            walletAddress: wallet.address.toLowerCase(), // Ensure lowercase
            username: `Player_${wallet.address.slice(0, 6)}`,
          }
          
          const response = await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(createPayload),
          })

          console.log('📡 Create response status:', response.status)
          
          if (!response.ok) {
            const errorText = await response.text()
            console.error('❌ Create user failed:', errorText)
            throw new Error(`Failed to create user: ${response.status} ${errorText}`)
          }

          user = await response.json()
          console.log('✅ User created successfully:', user)
        }

        // Update player stats with user data
        if (user?.stats) {
          console.log('📊 Updating stats from user:', user.stats)
          setPlayerStats((prev) => ({
            ...prev,
            points: user.stats.currentPoints || prev.points,
            tokens: user.stats.currentTokens || prev.tokens,
            totalWon: user.stats.totalWinnings || 0,
            gamesPlayed: user.stats.totalGamesPlayed || 0,
            winRate: user.stats.winRate || 0,
            bestMultiplier: user.stats.bestMultiplier || 0,
            rank: user.stats.rank || 0,
          }))
        }

        setUserExists(true)
        console.log('✅ User setup complete')

      } catch (error) {
        console.error("❌ User setup failed:", error)
        setUserExists(false)
      }
    }

    ensureUserExists()
  }, [wallet?.address])

  useEffect(() => {
  async function syncUser() {
    if (!wallet?.address) {
      console.log('⏳ No wallet address available yet');
      return;
    }

    console.log('🔍 Syncing user for address:', wallet.address);

    try {
      // Try to get the user first
      console.log('📡 Fetching user from API...');
      let user = await getUser(wallet.address);
      console.log('👤 User fetch result:', user);

      if (!user) {
        console.log('🆕 User not found, creating new user...');
        const createPayload = {
          walletAddress: wallet.address,
          username: wallet.address.slice(0, 6),
        };
        console.log('📤 Creating user with payload:', createPayload);

        const res = await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createPayload),
        });

        console.log('📡 Create user response status:', res.status);
        const responseText = await res.text();
        console.log('📡 Create user response body:', responseText);

        if (!res.ok) {
          throw new Error(`Failed to create user: ${res.status} ${responseText}`);
        }

        try {
          user = JSON.parse(responseText);
          console.log('✅ User created successfully:', user);
        } catch (parseError) {
          console.error('❌ Failed to parse user response:', parseError);
          throw new Error('Invalid JSON response from server');
        }
      }

      if (user?.stats) {
        console.log('📊 Updating player stats with:', user.stats);
        setPlayerStats((prev) => ({
          ...prev,
          ...user.stats,
        }));
      }
    } catch (error) {
      console.error("❌ User sync failed:", error);
      console.error("❌ Error details:", {
        message: error.message,
        stack: error.stack
      });
    }
  }

  syncUser();
}, [wallet?.address]);

  const [gameHistory, setGameHistory] = useState<GameResult[]>([])

  useEffect(() => {
    async function fetchGameHistory() {
      if (wallet?.address) {
        const history = await getHistory(wallet.address)
        setGameHistory(history)
      }
    }
    fetchGameHistory()
  }, [wallet?.address])

  const generateCrashPoint = useCallback(() => {
    const rand = Math.random()
    if (rand < 0.5) return 1 + Math.random() * 2 // 1x-3x (50% chance)
    if (rand < 0.8) return 3 + Math.random() * 7 // 3x-10x (30% chance)
    if (rand < 0.95) return 10 + Math.random() * 40 // 10x-50x (15% chance)
    if (rand < 0.99) return 50 + Math.random() * 200 // 50x-250x (4% chance)
    return 250 + Math.random() * 4750 // 250x-5000x (1% chance)
  }, [])

  const generateActivePlayers = useCallback(() => {
    const playerNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry"]
    const count = Math.floor(Math.random() * 8) + 3
    return Array.from({ length: count }, (_, i) => ({
      name: playerNames[i] || `Player${i}`,
      bet: Math.floor(Math.random() * 200) + 10,
      targetMultiplier: 1 + Math.random() * 10,
    }))
  }, [])

  // Improved game loop with better phase management
  useEffect(() => {
    if(!userExists) return

    let interval: NodeJS.Timeout
    let crashPoint = generateCrashPoint()

    const runGameLoop = () => {
      interval = setInterval(() => {
        setGameState((prev) => {
          switch (prev.phase) {
            case "waiting": {
              // Waiting phase before betting starts
              if (prev.timeLeft <= 1) {
                return {
                  ...prev,
                  phase: "betting",
                  currentMultiplier: 1.0,
                  timeLeft: 65, // 25 seconds for betting - much more comfortable
                  activePlayers: [],
                  playerBet: null,
                  crashPoint: undefined,
                }
              }
              return { ...prev, timeLeft: prev.timeLeft - 1 }
            }

            case "betting": {
              // Betting phase - users place their bets
              if (prev.timeLeft <= 1) {
                // Generate new crash point for this round
                crashPoint = generateCrashPoint()
                return {
                  ...prev,
                  phase: "flying",
                  currentMultiplier: 1.0,
                  timeLeft: 0,
                  activePlayers: generateActivePlayers(),
                  crashPoint,
                }
              }
              return { ...prev, timeLeft: prev.timeLeft - 1 }
            }

            case "flying": {
              // Flying phase - multiplier increases until crash
              const increment = 0.01 + prev.currentMultiplier * 0.002 // Slightly faster growth
              const newMultiplier = prev.currentMultiplier + increment

              if (newMultiplier >= crashPoint) {
                // Handle player bet result before crashing
                if (prev.playerBet && wallet?.address) { // Player didn't cash out
                  const gameResult = {
                    gameId: `${Date.now()}`,
                    betAmount: prev.playerBet,
                    targetMultiplier: 0,
                    cashedOutAt: 0,
                    cashedOutTime: new Date(),
                    winnings: 0,
                    won: false,
                    walletAddress: wallet?.address,
                  }
                  saveGameResult(gameResult)
                }


                // Add to game history
                const newResult: GameResult = {
                  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                  multiplier: crashPoint,
                  timestamp: new Date(),
                  players: prev.activePlayers.length + (prev.playerBet ? 1 : 0),
                  jackpot: crashPoint >= 75,
                }

                setGameHistory((prevHistory) => [newResult, ...prevHistory.slice(0, 19)]) // Keep last 20

                // Update player stats if they lost
                if (prev.playerBet) {
                  setPlayerStats((prevStats) => ({
                    ...prevStats,
                    gamesPlayed: prevStats.gamesPlayed + 1,
                    winRate: (prevStats.gamesPlayed > 0)
                      ? ((prevStats.winRate * prevStats.gamesPlayed) / (prevStats.gamesPlayed + 1))
                      : 0,
                  }))
                }

                return {
                  ...prev,
                  phase: "crashed",
                  currentMultiplier: crashPoint,
                  timeLeft: 6, // 6 seconds to show crash result
                  crashPoint,
                }
              }

              return {
                ...prev,
                currentMultiplier: newMultiplier,
              }
            }

            case "crashed": {
              // Crashed phase - show results and celebrate
              if (prev.timeLeft <= 1) {
                return {
                  ...prev,
                  phase: "waiting",
                  timeLeft: 4, // 4 seconds waiting before next betting phase
                }
              }
              return { ...prev, timeLeft: prev.timeLeft - 1 }
            }

            default:
              return prev
          }
        })
      }, 100) // Update every 100ms for smooth multiplier
    }

    runGameLoop()

    return () => {
      clearInterval(interval)
    }
  }, [generateCrashPoint, generateActivePlayers, playerStats, wallet?.address])

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
    async (amount: number) => {
      if (gameState.phase === "betting" && amount <= playerStats.points && amount > 0) {
        try {
          setGameState((prev) => ({ ...prev, playerBet: amount }))
          const newPoints = playerStats.points - amount
          setPlayerStats((prev) => ({ ...prev, points: newPoints }))
          
          // Update user stats in database
          await updateUser(wallet.address, { 
            stats: { 
              ...playerStats, 
              currentPoints: newPoints 
            } 
          })
          
          console.log('✅ Bet placed successfully:', amount)
        } catch (error) {
          console.error('❌ Failed to place bet:', error)
          // Revert the bet on error
          setGameState((prev) => ({ ...prev, playerBet: null }))
          setPlayerStats((prev) => ({ ...prev, points: prev.points + amount }))
        }
      }
    },
    [gameState.phase, playerStats, wallet?.address, userExists],
  )

  const cashOut = useCallback(async () => {
    if (!userExists || !wallet?.address || gameState.phase !== "flying" || !gameState.playerBet) {
      return
    }

    try {
      const winnings = gameState.playerBet * gameState.currentMultiplier
      const newPlayerStats = {
        ...playerStats,
        points: playerStats.points + winnings,
        totalWon: playerStats.totalWon + winnings,
        gamesPlayed: playerStats.gamesPlayed + 1,
        winRate: playerStats.gamesPlayed > 0
          ? (((playerStats.gamesPlayed * playerStats.winRate) / 100 + 1) / (playerStats.gamesPlayed + 1)) * 100
          : 100,
        bestMultiplier: Math.max(playerStats.bestMultiplier, gameState.currentMultiplier),
      }
      
      setPlayerStats({
        ...newPlayerStats,
        points: newPlayerStats.points,
        totalWon: newPlayerStats.totalWon,
        gamesPlayed: newPlayerStats.gamesPlayed,
        winRate: newPlayerStats.winRate,
        bestMultiplier: newPlayerStats.bestMultiplier,
      })
      setGameState((prev) => ({ ...prev, playerBet: null }))

      // Update database
      await updateUser(wallet.address, { 
        stats: {
          currentPoints: newPlayerStats.points,
          totalWinnings: newPlayerStats.totalWon,
          totalGamesPlayed: newPlayerStats.gamesPlayed,
          winRate: newPlayerStats.winRate,
          bestMultiplier: newPlayerStats.bestMultiplier,
        }
      })
      
      await saveGameResult({
        gameId: `${Date.now()}`,
        betAmount: gameState.playerBet,
        targetMultiplier: 0,
        cashedOutAt: gameState.currentMultiplier,
        cashedOutTime: new Date(),
        winnings,
        won: true,
        walletAddress: wallet.address,
      })
      
      console.log('✅ Cash out successful:', winnings)
    } catch (error) {
      console.error('❌ Cash out failed:', error)
    }
  }, [gameState, playerStats, wallet?.address, userExists])

  const claimFaucet = useCallback(() => {
    if (playerStats.faucetCooldown > 0) return

    // Instead of opening external link, give tokens directly for demo
    setPlayerStats((prev) => ({
      ...prev,
      tokens: prev.tokens + 100,
      faucetCooldown: 300, // 5 minute cooldown
    }))
  }, [playerStats.faucetCooldown])

  const convertTokensToPoints = useCallback(
    (amount: number) => {
      if (amount <= playerStats.tokens && amount > 0) {
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
    setGameState,
    userExists
  }
}