"use client"


import { useGameState } from "@/hooks/use-game-state"
import { useWallet } from "@/hooks/use-wallet"
import LeftSidebarTabs from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import { GameHeader } from "@/components/game-header"
import { MainGameArea } from "@/components/main-game-area"
import { BottomTabs } from "@/components/bottom-tabs"

export default function CrashGame() {
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
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <GameHeader
          isConnected={isConnected}
          wallet={wallet}
          onConnectWallet={connectWallet}
        />

        {/* Main Content Grid with equal heights */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Left Sidebar - 1 column, same height as main area */}
          <aside className="lg:col-span-1 h-full">
            <div className="h-full">
              <LeftSidebarTabs playerStats={playerStats} history={gameHistory} />
            </div>
          </aside>
             
          {/* Main Game Area - 3 columns */}
          <main className="lg:col-span-3 h-full">
            <div className="h-full">
              <MainGameArea gameState={gameState} gameHistory={gameHistory} />
            </div>
          </main>

          {/* Right Sidebar - 1 column, same height as main area */}
          <aside className="lg:col-span-1 h-full">
            <div className="h-full">
              <RightSidebar
                playerStats={playerStats}
                gameState={gameState}
                onConvertTokens={handleConvertTokens}
                onPlaceBet={handlePlaceBet}
                onCashOut={handleCashOut}
              />
            </div>
          </aside>
        </div>

        {/* Bottom Tabs - Full width */}
        <div className="w-full">
          <BottomTabs gameHistory={gameHistory} />
        </div>
      </div>
    </div>
  )
}