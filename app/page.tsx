"use client"

import LeftSidebarTabs from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import { GameHeader } from "@/components/game-header"
import { MainGameArea } from "@/components/main-game-area"
import { BottomTabs } from "@/components/bottom-tabs"
import { GameLayout } from "@/components/game-layout"
import { GameContent } from "@/components/game-content"
import { GameController } from "@/components/game-controller"

export default function CrashGame() {
  return (
    <GameLayout>
      <GameController>
        {({ 
          gameState, 
          playerStats, 
          gameHistory, 
          isConnected, 
          wallet, 
          onPlaceBet, 
          onCashOut, 
          onConvertTokens, 
          onConnectWallet 
        }) => (
          <>
            {/* Header */}
            <GameHeader
              isConnected={isConnected}
              wallet={wallet}
              onConnectWallet={onConnectWallet}
            />

            {/* Main Game Content */}
            <GameContent
              leftSidebar={
                <LeftSidebarTabs 
                  playerStats={playerStats} 
                  history={gameHistory} 
                />
              }
              mainContent={
                <MainGameArea 
                  gameState={gameState} 
                  gameHistory={gameHistory}
                  playerStats={playerStats}
                  onPlaceBet={onPlaceBet}
                  onCashOut={onCashOut}
                />
              }
              rightSidebar={
                <RightSidebar
                  playerStats={playerStats}
                  gameState={gameState}
                  onConvertTokens={onConvertTokens}
                  onPlaceBet={onPlaceBet}
                  onCashOut={onCashOut}
                />
              }
              bottomContent={
                <BottomTabs gameHistory={gameHistory} />
              }
            />
          </>
        )}
      </GameController>
    </GameLayout>
  )
}