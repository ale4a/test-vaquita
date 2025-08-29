"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { config } from "../config";
import USDCABI from "../abis/USDC.json";
import { useAccount } from "wagmi";

export function useUSDC() {
  const { address } = useAccount();

  // Hook para escribir en el contrato
  const { writeContract, data: hash } = useWriteContract();

  // Hook para esperar la transacción
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Hook para leer el balance de USDC
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: config.contracts.usdc as `0x${string}`,
    abi: USDCABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  // Hook para leer el allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: config.contracts.usdc as `0x${string}`,
    abi: USDCABI,
    functionName: "allowance",
    args: [
      address as `0x${string}`,
      config.contracts.vaquitaPool as `0x${string}`,
    ],
    query: {
      enabled: !!address,
    },
  });

  // Función para aprobar USDC
  const approve = async (amount: string) => {
    if (!address) {
      throw new Error("No hay wallet conectada");
    }

    const amountInWei = parseUnits(amount, 6); // USDC tiene 6 decimales

    await writeContract({
      address: config.contracts.usdc as `0x${string}`,
      abi: USDCABI,
      functionName: "approve",
      args: [config.contracts.vaquitaPool as `0x${string}`, amountInWei],
    });
  };

  // Verificar si necesita aprobación
  const needsApproval = (amount: string) => {
    if (!allowance || !amount) return true;

    const amountInWei = parseUnits(amount, 6);
    // Nos aseguramos de que allowance sea bigint antes de comparar
    if (typeof allowance !== "bigint") return true;
    return allowance < amountInWei;
  };

  return {
    balance: typeof balance === "bigint" ? formatUnits(balance, 6) : "0",
    allowance: typeof allowance === "bigint" ? formatUnits(allowance, 6) : "0",
    approve,
    needsApproval,
    refetchBalance,
    refetchAllowance,
    isLoading: isConfirming,
    isSuccess,
  };
}
