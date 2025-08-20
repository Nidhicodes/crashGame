"use client";

import { useState, useCallback, useEffect } from "react";
import { formatEther } from "viem";
import { ethers } from "ethers";
import axios from "axios";
import { getProfile, setProfile } from "@/lib/indexedDb";

interface Wallet {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  gasPrice: string | null;
  clientVersion: string | null;
  txCount: number | null;
  network: string | null;
}

// Add global type for window.qsafe
declare global {
  interface Window {
    qsafe?: {
      providers?: {
        ethereum?: any;
        ql1evm?: any;
      };
    };
  }
}

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (addr: string, provider: any) => {
    try {
      const [balanceHex, chainIdHex, gasPriceHex, clientVer, txCountHex] =
        await Promise.all([
          provider.request({
            method: "eth_getBalance",
            params: [addr, "latest"],
          }),
          provider.request({ method: "eth_chainId" }),
          provider.request({ method: "eth_gasPrice" }),
          provider.request({ method: "web3_clientVersion" }),
          provider.request({
            method: "eth_getTransactionCount",
            params: [addr, "latest"],
          }),
        ]);

      setWallet({
        address: addr,
        balance: formatEther(BigInt(balanceHex)),
        chainId: parseInt(chainIdHex, 16),
        gasPrice: formatEther(BigInt(gasPriceHex)),
        clientVersion: clientVer,
        txCount: parseInt(txCountHex, 16),
        network: "Quranium TestNet",
      });

      setIsConnected(true);
    } catch (err) {
      console.error("Error fetching wallet data:", err);
    }
  };

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    const provider = window?.qsafe?.providers?.ethereum;

    if (typeof provider?.request !== "function") {
      console.error("Qsafe provider not found");
      setIsConnecting(false);
      return;
    }

    try {
      // 1️⃣ Connect wallet
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const addr = accounts?.[0] || accounts?.address;
      if (!addr) throw new Error("No wallet address found");

      // 2️⃣ Fetch wallet info
      await fetchData(addr, provider);

      // 3️⃣ Call server-side login API
      const { data } = await axios.post("/api/auth/login", {
        walletAddress: addr,
      });
      const userData = data.user;

      // 4️⃣ Merge wallet info with server profile
      const balanceHex = await provider.request({
        method: "eth_getBalance",
        params: [addr, "latest"],
      });
      const balanceNum = Number(formatEther(BigInt(balanceHex)));

      let mergedProfile;
      if (!userData) {
        mergedProfile = {
          address: addr,
          lastLogin: new Date().toISOString(),
          tokens: balanceNum,
          points: 0,
          totalWon: 0,
          rank: 0,
        };
      } else {
        mergedProfile = { ...userData, tokens: balanceNum };
      }

      await setProfile(mergedProfile);
    } catch (err) {
      console.error("Wallet connection/login failed:", err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    setWallet(null);
    setIsConnected(false);

    // Clear JWT cookie server-side
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    // Revoke wallet permissions (optional)
    try {
      await window.qsafe?.providers?.ql1evm?.request?.({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      });
    } catch (err) {
      console.error("Disconnect error:", err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const provider = window?.qsafe?.providers?.ethereum;

      if (provider && typeof provider.request === "function") {
        try {
          const accounts = await provider.request({ method: "eth_accounts" });
          if (accounts?.length > 0) {
            const addr = accounts[0];
            await fetchData(addr, provider);

            // Server-side login if wallet already connected
            const { data } = await axios.post("/api/auth/login", {
              walletAddress: addr,
            });
            const userData = data.user;

            const balanceHex = await provider.request({
              method: "eth_getBalance",
              params: [addr, "latest"],
            });
            const balanceNum = Number(formatEther(BigInt(balanceHex)));

            let mergedProfile;
            if (!userData) {
              mergedProfile = {
                address: addr,
                lastLogin: new Date().toISOString(),
                tokens: balanceNum,
                points: 0,
                totalWon: 0,
                rank: 0,
              };
            } else {
              mergedProfile = { ...userData, tokens: balanceNum };
            }

            await setProfile(mergedProfile);
          }
        } catch (err) {
          console.error("Error fetching accounts:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    init();
  }, []);

  return {
    wallet,
    balance: wallet?.balance ?? null,
    isConnected: !!(wallet && wallet.address),
    isConnecting,
    isLoading,
    connectWallet,
    disconnectWallet,
  };
}
