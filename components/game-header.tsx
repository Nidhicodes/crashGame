"use client"

import { Button } from "@/components/ui/button"
import { Rocket, Zap } from "lucide-react"

interface Wallet {
  address: string | null
  balance: string | null
  chainId: number | null
  gasPrice: string | null
  clientVersion: string | null
  txCount: number | null
  network: string | null
}

interface GameHeaderProps {
  isConnected: boolean
  wallet: Wallet | null
  onConnectWallet: () => void
}

export function GameHeader({ isConnected, wallet, onConnectWallet }: GameHeaderProps) {
  return (
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
            onClick={onConnectWallet}
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
  )
} 