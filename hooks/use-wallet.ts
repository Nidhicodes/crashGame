"use client"

import { useState, useCallback, useEffect } from "react"
import { formatEther } from "viem"
import { ethers } from "ethers"

interface Wallet {
  address: string | null
  balance: string | null
  chainId: number | null
  gasPrice: string | null
  clientVersion: string | null
  txCount: number | null
  network: string | null
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
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
        ])

      setWallet({
        address: addr,
        balance: formatEther(BigInt(balanceHex)),
        chainId: parseInt(chainIdHex, 16),
        gasPrice: formatEther(BigInt(gasPriceHex)),
        clientVersion: clientVer,
        txCount: parseInt(txCountHex, 16),
        network: "Quranium TestNet",
      })
      
      setIsConnected(true)
    } catch (err) {
      console.error("Error fetching wallet data:", err)
    }
  }

  const connectWallet = useCallback(async () => {
    setIsConnecting(true)
    const provider = window?.qsafe?.providers?.ethereum
    
    if (typeof provider.request === "function") {
      try {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        })
        const addr = accounts?.[0] || accounts?.address
        await fetchData(addr, provider)
      } catch (err) {
        console.error("Qsafe connection error:", err)
      } finally {
        setIsConnecting(false)
      }
    }
  }, [])

  const disconnectWallet = useCallback(async () => {
    setWallet(null)
    setIsConnected(false)
    try {
      await window.qsafe?.providers?.ql1evm?.request?.({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      })
    } catch (err) {
      console.error("Disconnect error:", err)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      const provider = window?.qsafe?.providers?.ethereum
      
      if (provider && typeof provider.request === "function" ) {
        try {
          const accounts = await provider.request({ method: "eth_accounts" })
          if (accounts?.length > 0) {
            const addr = accounts[0]
            await fetchData(addr, provider)
          }
        } catch (err) {
          console.error("Error fetching accounts:", err)
        } finally {
          setIsLoading(false)
        }
      }
      try {
        const browserProvider = new ethers.BrowserProvider(provider)
        let chainId = ""
        const rawChainId = ""
        if (typeof rawChainId === "string") {
          chainId = rawChainId.startsWith("0x")
            ? rawChainId.toLowerCase()
            : `0x${parseInt(rawChainId, 10).toString(16).toLowerCase()}`
        } else if (typeof rawChainId === "number") {
          chainId = `0x${rawChainId}`
        } else {
          chainId = "0x3dfb48" // fallback Quranium chainId
        }
        const expectedQuraniumChainId = "0x3dfb48"
        if (chainId !== expectedQuraniumChainId) {
          try {
            await browserProvider.send("wallet_addEthereumChain", [
              {
                chainId: expectedQuraniumChainId,
                chainName: "Quranium Testnet",
                rpcUrls: ["https://tqrn-node1.quranium.org/node"],
                nativeCurrency: {
                  name: "Quranium",
                  symbol: "QRN",
                  decimals: 18,
                },
                blockExplorerUrls: [],
              },
            ])
          } catch (addError) {
            console.error("Error adding Quranium chain:", addError)
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            "Failed to fetch chainId from QSafe provider:",
            error.message
          )
        } else {
          console.error("Failed to fetch chainId from QSafe provider:", error)
        }
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  return {
    wallet,
    balance: wallet?.balance ?? null,
    isConnected: !!(wallet && wallet.address),
    isConnecting,
    isLoading,
    connectWallet,
    disconnectWallet,
  }
}
