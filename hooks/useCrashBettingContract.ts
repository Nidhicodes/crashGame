import { useCallback, useMemo } from "react";
import { ethers } from "ethers";
import CrashBettingAbi from "../abi/CrashBetting.json";

// Replace with your deployed contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

export function useCrashBettingContract(provider: ethers.Provider | ethers.Signer | null) {
  const contract = useMemo(() => {
    if (!provider) return null;
    return new ethers.Contract(CONTRACT_ADDRESS, CrashBettingAbi.abi, provider);
  }, [provider]);

  // Write functions
  const startRound = useCallback(async () => {
    if (!contract) throw new Error("Contract not initialized");
    const tx = await contract.startRound();
    return tx.wait();
  }, [contract]);

  const placeBet = useCallback(async (amount: ethers.BigNumberish) => {
    if (!contract) throw new Error("Contract not initialized");
    const tx = await contract.placeBet(amount);
    return tx.wait();
  }, [contract]);

  const cashOut = useCallback(async (multiplier: ethers.BigNumberish) => {
    if (!contract) throw new Error("Contract not initialized");
    const tx = await contract.cashOut(multiplier);
    return tx.wait();
  }, [contract]);

  const endRound = useCallback(async (finalMultiplier: ethers.BigNumberish) => {
    if (!contract) throw new Error("Contract not initialized");
    const tx = await contract.endRound(finalMultiplier);
    return tx.wait();
  }, [contract]);

  // Read functions
  const getPlayerPoints = useCallback(
    async (player: string) => {
      if (!contract) throw new Error("Contract not initialized");
      return contract.getPlayerPoints(player);
    },
    [contract]
  );

  const getPlayers = useCallback(async () => {
    if (!contract) throw new Error("Contract not initialized");
    return contract.getPlayers();
  }, [contract]);

  const getPlayerBet = useCallback(
    async (player: string) => {
      if (!contract) throw new Error("Contract not initialized");
      return contract.getPlayerBet(player);
    },
    [contract]
  );

  // State queries
  const getRoundActive = useCallback(async () => {
    if (!contract) throw new Error("Contract not initialized");
    return contract.roundActive();
  }, [contract]);

  const getRoundEnded = useCallback(async () => {
    if (!contract) throw new Error("Contract not initialized");
    return contract.roundEnded();
  }, [contract]);

  const getAdmin = useCallback(async () => {
    if (!contract) throw new Error("Contract not initialized");
    return contract.admin();
  }, [contract]);

  return {
    contract,
    startRound,
    placeBet,
    cashOut,
    endRound,
    getPlayerPoints,
    getPlayers,
    getPlayerBet,
    getRoundActive,
    getRoundEnded,
    getAdmin,
  };
} 