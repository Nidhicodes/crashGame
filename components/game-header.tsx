"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, Zap, Menu, X } from "lucide-react";
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

export function FloatingNavbar({
  referralCode,
  referralStats,
}: FloatingNavbarProps) {
  const { wallet, isConnected, isConnecting, connectWallet } = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleConnectAndLogin = async () => {
    try {
      await connectWallet(); // will handle QSafe + server-side JWT login
      const token = Cookies.get("token");
      if (token) toast.success("User logged in!");
      else toast.error("Login failed, no token received");
      // Close mobile menu after connecting (optional)
      setMobileOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect wallet or log in.");
    }
  };

  // click outside to close mobile menu
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!mobileOpen) return;
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMobileOpen(false);
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 py-3 backdrop-blur-md bg-black/70 border-b border-purple-500/20 shadow-lg shadow-purple-500/25">
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

      {/* Desktop / tablet actions (shown on sm and up) */}
      <div className="hidden sm:flex items-center gap-4">
        <ReferralDialog
          referralCode={referralCode}
          referralStats={referralStats}
        />

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

      {/* Mobile hamburger (shown only below sm) */}
      <div className="sm:hidden flex items-center">
        <button
          ref={buttonRef}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((s) => !s)}
          className="p-2 rounded-md bg-black/30 hover:bg-black/40 border border-purple-500/10"
          title="Menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div
          ref={menuRef}
          className="sm:hidden absolute top-full right-4 mt-2 w-[min(92vw,320px)] bg-black/85 backdrop-blur-md border border-purple-500/20 rounded-xl shadow-xl shadow-purple-900/40 p-3 z-50"
        >
          <div className="flex flex-col gap-3">
            {/* ReferralDialog: render a compact button for mobile */}
            <div>
              <ReferralDialog
                referralCode={referralCode}
                referralStats={referralStats}
              />
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5" />

            {/* Connect / Wallet info */}
            {!isConnected ? (
              <Button
                onClick={handleConnectAndLogin}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-md shadow-purple-500/20 border border-purple-500/20"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            ) : (
              <div className="flex items-center justify-between gap-3 px-3 py-2 bg-purple-600/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <div>
                    <div className="text-sm font-mono text-purple-200">
                      {wallet?.address?.slice(0, 6)}...{wallet?.address?.slice(-4)}
                    </div>
                    <div className="text-xs text-purple-300">Connected</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    // optional: open a wallet modal or show more actions
                    setMobileOpen(false);
                  }}
                  className="px-2 py-1"
                >
                  Details
                </Button>
              </div>
            )}

           
          </div>
        </div>
      )}
    </nav>
  );
}
