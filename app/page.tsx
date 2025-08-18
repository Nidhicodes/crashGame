"use client"

import LeftSidebarTabs from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"

import { MainGameArea } from "@/components/main-game-area"
import { BottomTabs } from "@/components/bottom-tabs"
import { GameLayout } from "@/components/game-layout"
import { GameContent } from "@/components/game-content"
import { GameController } from "@/components/game-controller"
import { FloatingNavbar } from "@/components/game-header"

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
            <FloatingNavbar
              isConnected={isConnected}
              wallet={wallet}
              onConnectWallet={onConnectWallet}
              referralCode="TEMP123"
              referralStats={{ totalReferrals: 0, rewards: 0 }}
            />

            {/* Add top padding so content does not overlap navbar */}
            <div className="pt-24">
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
            </div>
          </>
        )}
      </GameController>
    </GameLayout>
  )
}
