"use client";

import { useState } from "react";
import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { config } from "../config";
import VaquitaPoolABI from "../abis/VaquitaPool.json";
import { useAccount } from "wagmi";

export function useVaquitaPool() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hook para escribir en el contrato
  const { writeContract, data: hash } = useWriteContract();

  // Hook para esperar la transacción
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Hook para leer depósitos del usuario
  const { data: userDeposits, refetch: refetchDeposits } = useReadContract({
    address: config.contracts.vaquitaPool as `0x${string}`,
    abi: VaquitaPoolABI.abi,
    functionName: "getUserDeposits",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  // Función para depositar
  const deposit = async (amount: string) => {
    if (!address) {
      setError("No hay wallet conectada");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const amountInWei = parseUnits(amount, 6); // USDC tiene 6 decimales
      const period = 60; // 1 minuto en segundos
      const tokenAddress = config.contracts.usdc as `0x${string}`;

      await writeContract({
        address: config.contracts.vaquitaPool as `0x${string}`,
        abi: VaquitaPoolABI.abi,
        functionName: "deposit",
        args: [amountInWei, BigInt(period), tokenAddress, address],
      });
    } catch (err) {
      console.error("Error al depositar:", err);
      setError(err instanceof Error ? err.message : "Error al depositar");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para retirar
  const withdraw = async (depositId: number) => {
    if (!address) {
      setError("No hay wallet conectada");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await writeContract({
        address: config.contracts.vaquitaPool as `0x${string}`,
        abi: VaquitaPoolABI.abi,
        functionName: "withdraw",
        args: [BigInt(depositId)],
      });
    } catch (err) {
      console.error("Error al retirar:", err);
      setError(err instanceof Error ? err.message : "Error al retirar");
    } finally {
      setIsLoading(false);
    }
  };

  // Definir el tipo para depósito
  type Deposit = {
    id: bigint | number;
    amount: bigint | number;
    period: bigint | number;
    startTime: bigint | number;
    withdrawn: boolean;
    token: string;
    user: string;
  };

  // Función para verificar si un depósito puede ser retirado
  const canWithdraw = (deposit: Deposit | undefined | null) => {
    if (!deposit || deposit.withdrawn) return false;

    const startTime =
      typeof deposit.startTime === "bigint"
        ? Number(deposit.startTime)
        : deposit.startTime;
    const period =
      typeof deposit.period === "bigint"
        ? Number(deposit.period)
        : deposit.period;
    const currentTime = Math.floor(Date.now() / 1000);

    return currentTime >= startTime + period;
  };

  // Formatear depósitos para la UI
  const formattedDeposits = Array.isArray(userDeposits)
    ? userDeposits.map((deposit: Deposit) => ({
        id: Number(deposit.id),
        amount: formatUnits(
          typeof deposit.amount === "bigint"
            ? deposit.amount
            : BigInt(deposit.amount),
          6,
        ),
        period: Number(deposit.period),
        startTime: Number(deposit.startTime),
        withdrawn: deposit.withdrawn,
        token: deposit.token,
        user: deposit.user,
        canWithdraw: canWithdraw(deposit),
        depositIdHex: Number(deposit.id).toString(16),
        createdAt: new Date(Number(deposit.startTime) * 1000).toISOString(),
      }))
    : [];

  return {
    deposit,
    withdraw,
    userDeposits: formattedDeposits,
    refetchDeposits,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
    clearError: () => setError(null),
  };
}
