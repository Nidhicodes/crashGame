"use client";

import { Button } from "@/components/ui/button";
import { Rocket, Zap } from "lucide-react";
import { ReferralDialog } from "./Dialogs/ReferralDialog";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useWallet } from "@/hooks/use-wallet";

interface FloatingNavbarProps {
  referralCode: string;
  referralStats: {
    totalReferrals: number;
    bonusPointsEarned: number;
    bonusFaucetTokens: number;
    hasUsedReferralCode: boolean;
  };
}

export function FloatingNavbar({ referralCode, referralStats }: FloatingNavbarProps) {
  const { wallet, isConnected, isConnecting, connectWallet } = useWallet();

  const handleConnectAndLogin = async () => {
    try {
      await connectWallet(); // will handle QSafe + server-side JWT login
      const token = Cookies.get("token");
      if (token) toast.success("User logged in!");
      else toast.error("Login failed, no token received");
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect wallet or log in.");
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
            disabled={isConnecting}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/25 border border-purple-500/20"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
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
