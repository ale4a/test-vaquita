// Configuración para Base Mainnet
export const config = {
  // Base Mainnet
  base: {
    chainId: 8453,
    name: "Base",
    network: "base",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["https://mainnet.base.org"],
      },
      public: {
        http: ["https://mainnet.base.org"],
      },
    },
    blockExplorers: {
      default: {
        name: "BaseScan",
        url: "https://basescan.org",
      },
    },
  },

  // Contratos
  contracts: {
    vaquitaPool: "0x2bC60217Aa862696e96eB831B8b67BF0BB14D407",
    usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC en Base mainnet
  },

  // Configuración de la miniapp
  miniapp: {
    name: "Vaquita MiniApp",
    description: "Staking de USDC basado en el algoritmo de Vaquita en Base",
    url: "https://test-vaquita.vercel.app",
    frameUrl: "https://test-vaquita.vercel.app/miniapp/frame",
  },

  // Configuración de Farcaster
  farcaster: {
    frameImage: "https://test-vaquita.vercel.app/logo_vaquita.png",
    frameUrl: "https://test-vaquita.vercel.app/miniapp/frame",
  },
};
