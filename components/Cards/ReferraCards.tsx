"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, CheckCircle, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface UserStats {
  walletAddress: string;
  username: string;
  stats: {
    currentPoints: number;
  };
  referralCode: string;
  referredBy?: string | null;
}

export function ReferralCard() {
  const [referralCode, setReferralCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  // Fetch user details on mount
  const fetchUserDetails = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data: UserStats = await res.json();
      if (res.ok) {
        setReferralCode(data.referralCode);
        if (data.referredBy) setAppliedCode(data.referredBy);
      } else {
        toast.error(data.error || "Failed to fetch user details");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch user details");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleApplyReferral = async () => {
    if (!inputCode.trim()) {
      toast.error("Enter a referral code");
      return;
    }
    setIsApplying(true);
    try {
      const res = await fetch("/api/referral/apply-referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: inputCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to apply referral code");
      } else {
        toast.success(data.message || "Referral applied successfully");
        setAppliedCode(inputCode);
        setInputCode("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply referral code");
    } finally {
      setIsApplying(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <Card className="w-full max-w-md mx-auto border border-purple-500/20 bg-gradient-to-br from-[#0f0f1a] to-[#1a0f1f] shadow-2xl rounded-3xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
          🚀 Invite Friends
          <span className="text-sm px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
            Boost Rewards
          </span>
        </CardTitle>
        <p className="text-xs text-purple-200/70 mt-1">
          Share your referral code to earn bonuses!
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Apply Referral Code Section */}
        {!appliedCode && (
          <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 space-y-3">
            <p className="text-xs text-green-200/70 mb-2">Apply a Referral Code</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Enter referral code"
                className="bg-black/30 border-green-500/30 font-mono text-sm text-green-100 flex-1"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
              />
              <Button
                size="sm"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-md flex items-center gap-1 px-3 py-1 transition-all"
                onClick={handleApplyReferral}
                disabled={isApplying}
              >
                <UserPlus className="w-4 h-4 text-white" /> {isApplying ? "Applying..." : "Apply"}
              </Button>
            </div>
          </div>
        )}

        {/* Applied Referral Info */}
        {appliedCode && (
          <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 space-y-1">
            <p className="text-xs text-green-200/70 mb-1">Referral Applied</p>
            <p className="text-sm text-green-100 font-mono">{appliedCode}</p>
          </div>
        )}

        {/* User Referral Code */}
        <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 hover:bg-purple-600/10 transition-colors">
          <div>
            <p className="text-xs text-purple-200/70">Your Referral Code</p>
            <p className="text-lg font-mono font-semibold text-purple-300">{referralCode || "—"}</p>
          </div>
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center gap-1 px-3 py-1 transition-colors"
            onClick={() => handleCopy(referralCode)}
          >
            <Copy className="w-4 h-4" /> Copy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
