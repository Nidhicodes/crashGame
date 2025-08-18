"use client";

import { Button } from "@/components/ui/button";
import { Rocket, Zap } from "lucide-react";
import { ReferralDialog } from "./Dialogs/ReferralDialog";
import axios from "axios"
import { toast } from "sonner"
interface Wallet {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  gasPrice: string | null;
  clientVersion: string | null;
  txCount: number | null;
  network: string | null;
}

interface FloatingNavbarProps {
  isConnected: boolean;
  wallet: Wallet | null;
  onConnectWallet: () => Promise<string>; // make it async if wallet connection is async
  referralCode: string;
  referralStats: {
    totalReferrals: number;
    bonusPointsEarned: number;
    bonusFaucetTokens: number;
    hasUsedReferralCode: boolean;
  };
}

export function FloatingNavbar({
  isConnected,
  wallet,
  onConnectWallet,
  referralCode,
  referralStats,
}: FloatingNavbarProps) {

  const handleConnectAndLogin = async () => {
  try {
    const walletAddress = await onConnectWallet(); // get address from connectWallet
    if (!walletAddress) {
      alert("Wallet address not found!");
      return;
    }

    const response = await axios.post(
      "http://localhost:5000/api/auth",
      { walletAddress },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );

    console.log("Logged in:", response.data);
    toast("User Logged in!")
  } catch (err) {
    console.error(err);
    alert("Failed to connect wallet or log in.");
  }
};



  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 backdrop-blur-md bg-black/70 border-b border-purple-500/20 shadow-lg shadow-purple-500/25">
      {/* Logo / Title */}
      <div className="flex items-center gap-3">
        <div className="relative p-2 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-md shadow-purple-500/25">
          <Rocket className="h-6 w-6 text-white" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        </div>
        <h1 className="text-lg font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          Quantum Crash
        </h1>
      </div>

      {/* Navbar Actions */}
      <div className="flex items-center gap-4">
        <ReferralDialog referralCode={referralCode} referralStats={referralStats} />

        {!isConnected ? (
          <Button
            onClick={handleConnectAndLogin}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/25 border border-purple-500/20"
          >
            <Zap className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 rounded-lg border border-purple-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-mono font-medium text-purple-200">
              {wallet?.address?.slice(0, 6)}...{wallet?.address?.slice(-4)}
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}
