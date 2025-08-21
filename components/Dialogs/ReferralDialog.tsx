"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { ReferralCard } from "../Cards/ReferraCards";

interface ReferralStats {
  totalReferrals: number;
  bonusPointsEarned: number;
  bonusFaucetTokens: number;
  hasUsedReferralCode: boolean;
}

interface ReferralDialogProps {
  referralCode: string;
  referralStats: ReferralStats;
}

export function ReferralDialog({ referralCode, referralStats }: ReferralDialogProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [enteredReferralCode, setEnteredReferralCode] = useState("");

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  };

  const handleApplyReferralCode = () => {
    if (!enteredReferralCode.trim()) return;
    console.log("Applying referral code:", enteredReferralCode);
    // 🔗 call backend API
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-purple-300 hover:text-purple-100"
        >
          <Gift className="w-4 h-4" />
          Referral System
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg bg-black/90 border border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-purple-200">Referral System</DialogTitle>
        </DialogHeader>

        <ReferralCard
          referralCode={referralCode}
          copySuccess={copySuccess}
          handleCopyReferralCode={handleCopyReferralCode}
          referralStats={referralStats}
          enteredReferralCode={enteredReferralCode}
          setEnteredReferralCode={setEnteredReferralCode}
          handleApplyReferralCode={handleApplyReferralCode}
        />
      </DialogContent>
    </Dialog>
  );
}
