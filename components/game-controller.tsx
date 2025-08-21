import { useGameState } from "@/hooks/use-game-state"
import { useWallet } from "@/hooks/use-wallet"
import { ReactNode } from "react"
import { GameState, PlayerStats, GameResult, Wallet, GameActions } from "@/types/game"

interface GameControllerProps {
  children: (props: {
    gameState: GameState
    playerStats: PlayerStats
    gameHistory: GameResult[]
    isConnected: boolean
    wallet: Wallet | null
  } & GameActions) => ReactNode
}

export function GameController({ children }: GameControllerProps) {
  const { gameState, playerStats, gameHistory, placeBet, cashOut, convertTokensToPoints } = useGameState()
  const { wallet, connectWallet, isConnected } = useWallet()

  const handlePlaceBet = (amount: number) => {
    placeBet(amount)
  }

  const handleCashOut = () => {
    cashOut()
  }

  const handleConvertTokens = (amount: number) => {
    convertTokensToPoints(amount)
  }

  return (
    <>
      {children({
        gameState,
        playerStats,
        gameHistory,
        isConnected,
        wallet,
        onPlaceBet: handlePlaceBet,
        onCashOut: handleCashOut,
        onConvertTokens: handleConvertTokens,
        onConnectWallet: connectWallet,
      })}
    </>
  )
} 