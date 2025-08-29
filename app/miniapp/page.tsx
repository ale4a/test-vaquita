"use client";

import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useVaquitaPool } from "../../lib/hooks/useVaquitaPool";
import { useUSDC } from "../../lib/hooks/useUSDC";
import { useAccount } from "wagmi";

export default function MiniAppPage() {
  const [amount, setAmount] = useState<string>("");
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { address } = useAccount();

  // Hooks de contratos
  const {
    deposit,
    withdraw,
    userDeposits,
    refetchDeposits,
    isLoading,
    isSuccess,
    error,
    clearError,
  } = useVaquitaPool();
  const { approve, needsApproval, isLoading: isApproving } = useUSDC();

  // Inicializar MiniKit
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Limpiar error cuando cambie
  useEffect(() => {
    if (error) {
      setTimeout(() => clearError(), 5000);
    }
  }, [error, clearError]);

  // Refetch cuando se complete una transacción
  useEffect(() => {
    if (isSuccess) {
      refetchDeposits();
    }
  }, [isSuccess, refetchDeposits]);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) < 0.1) {
      alert("Por favor ingresa un monto válido (mínimo 0.1 USDC)");
      return;
    }

    try {
      // Verificar si necesita aprobación
      if (needsApproval(amount)) {
        await approve(amount);
      }

      // Hacer el depósito
      await deposit(amount);
      setAmount("");
    } catch (err) {
      console.error("Error en depósito:", err);
    }
  };

  const handleWithdraw = async (depositId: number) => {
    if (address) {
      alert("Por favor conecta tu wallet primero");
      return;
    }

    try {
      await withdraw(depositId);
    } catch (err) {
      console.error("Error en retiro:", err);
    }
  };

  // Función para copiar dirección
  const copyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    // Aquí podrías mostrar un toast
  };

  // Función para acortar dirección
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-200">
            <p className="text-sm text-red-800">❌ {error}</p>
          </div>
        )}

        {/* Success Message */}
        {isSuccess && (
          <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
            <p className="text-sm text-green-800">
              ✅ Transacción completada exitosamente
            </p>
          </div>
        )}

        {/* Wallet Status */}

        <div className="space-y-4">
          <Wallet className="z-10 w-full">
            <div className="flex  gap-2 w-full">
              <h1 className="w-full text-3xl font-bold text-gray-800 mb-2">
                🐮 Vaquita
              </h1>
              <ConnectWallet className="w-full" />
            </div>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
        {address ? (
          <>
            {/* Deposit Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 my-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                ¿Cuánto USDC quieres stakear?
              </h2>

              {/* Amount Selection Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { value: "0.1", label: "0.1 USDC" },
                  { value: "0.5", label: "0.5 USDC" },
                  { value: "1", label: "1 USDC" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAmount(option.value)}
                    className={`px-4 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                      amount === option.value
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 hover:bg-gray-200 text-black hover:scale-102"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Selected Amount Display */}
              {address && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      Cantidad seleccionada
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {amount} USDC
                    </p>
                  </div>
                </div>
              )}
              {/* Lock period info */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-xl">⚡</span>
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Solo 1 minuto de bloqueo
                    </p>
                  </div>
                </div>
              </div>
              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleDeposit}
                  disabled={!address || !amount || isLoading || isApproving}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold px-6 py-4 rounded-xl text-lg disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading || isApproving
                    ? "⏳ Procesando..."
                    : amount
                      ? `🚀 Stakear ${amount} USDC`
                      : "Selecciona una cantidad"}
                </button>
              </div>
            </div>

            {/* Deposits List */}
            {userDeposits.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Mis Depósitos
                </h2>

                <div className="space-y-3">
                  {userDeposits.map(
                    (deposit: {
                      id: number;
                      amount: string;
                      period: number;
                      startTime: number;
                      withdrawn: boolean;
                      token: string;
                      user: string;
                      canWithdraw: boolean;
                      depositIdHex: string;
                      createdAt: string;
                    }) => (
                      <div
                        key={deposit.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {deposit.amount} USDC
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {shortenAddress(deposit.depositIdHex)}
                              <button
                                onClick={() =>
                                  copyAddress(deposit.depositIdHex)
                                }
                                className="ml-2 text-blue-500 hover:text-blue-700"
                                title="Copiar ID"
                              >
                                📋
                              </button>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              {new Date(deposit.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(deposit.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              deposit.withdrawn
                                ? "bg-gray-100 text-gray-600"
                                : deposit.canWithdraw
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {deposit.withdrawn
                              ? "Retirado"
                              : deposit.canWithdraw
                                ? "Listo para retirar"
                                : "En bloqueo"}
                          </span>

                          {!deposit.withdrawn && deposit.canWithdraw && (
                            <button
                              onClick={() => handleWithdraw(deposit.id)}
                              disabled={isLoading}
                              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white text-xs px-3 py-1 rounded disabled:cursor-not-allowed"
                            >
                              {isLoading ? "⏳" : "Retirar"}
                            </button>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
            {/* Disclaimer */}
            <div className="bg-yellow-50 rounded-xl p-4 mb-4 border border-yellow-200">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                ⚠️ Disclaimer
              </h3>
              <p className="text-xs text-yellow-700 leading-relaxed">
                Este es un staking de USDC basado en el algoritmo de Vaquita.
                Los fondos están sujetos a un período de bloqueo de 1 minuto
                antes de poder ser retirados.
              </p>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center my-2">
            <div className="mb-6">
              <div className="text-6xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Conecta tu Wallet
              </h3>
              <p className="text-gray-600 mb-6">
                Para comenzar a stakear USDC, necesitas conectar tu wallet
                primero
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-2xl">🐮</span>
                <span className="text-lg font-semibold text-blue-800">
                  Vaquita Protocol
                </span>
              </div>
              <p className="text-sm text-blue-700 mb-4">
                Staking de USDC con solo 1 minuto de bloqueo
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs text-blue-600">
                <div className="bg-blue-100 rounded-lg p-2">
                  <div className="font-bold">0.5 USDC</div>
                  <div>Mínimo</div>
                </div>
                <div className="bg-blue-100 rounded-lg p-2">
                  <div className="font-bold">1 min</div>
                  <div>Bloqueo</div>
                </div>
                <div className="bg-blue-100 rounded-lg p-2">
                  <div className="font-bold">Base</div>
                  <div>Red</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Red: Base Mainnet | Token: USDC | Mínimo: 0.1 USDC
          </p>
        </div>
      </div>
    </div>
  );
}
