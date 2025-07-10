import { getContract } from 'wagmi/actions';
import { abi } from '@/abi/CrashBetting.json'; // Adjust path if ABI is elsewhere

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

export const crashContract = getContract({
  address: CONTRACT_ADDRESS,
  abi,
  chainId: CHAIN_ID,
});