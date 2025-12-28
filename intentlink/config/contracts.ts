/**
 * IntentLink Smart Contract Addresses
 * Updated for IntentWalletV2 + StakingFarmV3 deployment
 * 
 * Contract addresses are loaded from environment variables.
 * See .env.example for configuration.
 */

export interface ChainContracts {
  IntentWallet: `0x${string}`;
  StakingFarm: `0x${string}`;      // V3 - Supports stakeFor/unstakeFor/claimRewardsFor
  StakingFarmV2?: `0x${string}`;   // V2 - Legacy (kept for reference)
  MockUSDT: `0x${string}`;
  MockDEX: `0x${string}`;
  MockLending: `0x${string}`;
}

export const CONTRACTS: Record<number, ChainContracts> = {
  // BlockDAG Awakening Testnet (Chain ID: 1043)
  1043: {
    IntentWallet: (process.env.NEXT_PUBLIC_BLOCKDAG_INTENT_WALLET || "0xe3dad1813a5c75fba505780a386a81fd3b8777e4") as `0x${string}`,
    StakingFarm: (process.env.NEXT_PUBLIC_BLOCKDAG_STAKING_FARM || "0x0aD823F27D89dDEf66833849df2e1CD36d06a652") as `0x${string}`,      // V3
    StakingFarmV2: (process.env.NEXT_PUBLIC_BLOCKDAG_STAKING_FARM_V2 || "0xb39a039ba3abd16d97334f6c3c5bda9b8e59dae6") as `0x${string}`,   // V2 Legacy
    MockUSDT: (process.env.NEXT_PUBLIC_BLOCKDAG_MOCK_USDT || "0x3a06d4bb208bddb40044630f2b269449e9119c4d") as `0x${string}`,
    MockDEX: (process.env.NEXT_PUBLIC_BLOCKDAG_MOCK_DEX || "0xbC47d9625e7c102C6E9C08D29BbD3A76514eCB56") as `0x${string}`,
    MockLending: (process.env.NEXT_PUBLIC_BLOCKDAG_MOCK_LENDING || "0xa23bDd28F9221F275897D8A26A8eb97A341cd257") as `0x${string}`,
  },
  // Polygon Amoy Testnet (Chain ID: 80002)
  80002: {
    IntentWallet: (process.env.NEXT_PUBLIC_POLYGON_INTENT_WALLET || "0x0881a837699208342675591b48910e3f5cfd951d") as `0x${string}`,
    StakingFarm: (process.env.NEXT_PUBLIC_POLYGON_STAKING_FARM || "0x3c26f13764F3d48f21325cf3cE48972d015bCf21") as `0x${string}`,      // V3
    StakingFarmV2: (process.env.NEXT_PUBLIC_POLYGON_STAKING_FARM_V2 || "0x90cf57776668a181f2ac483879173e2a8b09cf1b") as `0x${string}`,   // V2 Legacy
    MockUSDT: (process.env.NEXT_PUBLIC_POLYGON_MOCK_USDT || "0x0e454e74e925cd61e76d13c99b0d09b11250e091") as `0x${string}`,
    MockDEX: (process.env.NEXT_PUBLIC_POLYGON_MOCK_DEX || "0xbC47d9625e7c102C6E9C08D29BbD3A76514eCB56") as `0x${string}`,
    MockLending: (process.env.NEXT_PUBLIC_POLYGON_MOCK_LENDING || "0x1b227df9c8d34cab880774737fbf426e66ba98ed") as `0x${string}`,
  },
};

/**
 * Chain configuration
 */
export interface ChainConfig {
  name: string;
  currency: string;
  rpcUrl: string;
  explorerUrl: string;
  features?: string[];
}

export const CHAIN_CONFIG: Record<number, ChainConfig> = {
  1043: {
    name: "BlockDAG Awakening Testnet",
    currency: "BDAG",
    rpcUrl: process.env.NEXT_PUBLIC_BLOCKDAG_RPC_URL || "https://rpc-primordial.blockdag.network",
    explorerUrl: process.env.NEXT_PUBLIC_BLOCKDAG_EXPLORER_URL || "https://awakening.bdagscan.com",
    features: ["⚡ Ultra Fast", "💰 Low Fees", "🔒 Secure"],
  },
  80002: {
    name: "Polygon Amoy Testnet",
    currency: "POL",
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://rpc-amoy.polygon.technology",
    explorerUrl: process.env.NEXT_PUBLIC_POLYGON_EXPLORER_URL || "https://amoy.polygonscan.com",
    features: ["🌐 Cross-chain", "💧 High Liquidity", "🏛️ Established"],
  },
};

/**
 * Token prices (mock - will be replaced by V2 prices API)
 * Loaded from environment variables with fallback defaults
 */
export const TOKEN_PRICES: Record<string, number> = {
  BDAG: parseFloat(process.env.NEXT_PUBLIC_PRICE_BDAG || "0.05"),
  POL: parseFloat(process.env.NEXT_PUBLIC_PRICE_POL || "0.35"),
  USDT: parseFloat(process.env.NEXT_PUBLIC_PRICE_USDT || "1.00"),
  ETH: parseFloat(process.env.NEXT_PUBLIC_PRICE_ETH || "3500.00"),
};

/**
 * Get contracts for a specific chain
 */
export function getContracts(chainId: number): ChainContracts | null {
  return CONTRACTS[chainId] || null;
}

/**
 * Get chain config
 */
export function getChainConfig(chainId: number): ChainConfig | null {
  return CHAIN_CONFIG[chainId] || null;
}

/**
 * Get explorer URL for a transaction
 */
export function getTxExplorerUrl(chainId: number, txHash: string): string {
  const config = CHAIN_CONFIG[chainId];
  const defaultExplorer = process.env.NEXT_PUBLIC_BLOCKDAG_EXPLORER_URL || "https://awakening.bdagscan.com";
  if (!config) return `${defaultExplorer}/tx/${txHash}`;
  return `${config.explorerUrl}/tx/${txHash}`;
}

/**
 * Get explorer URL for an address
 */
export function getAddressExplorerUrl(chainId: number, address: string): string {
  const config = CHAIN_CONFIG[chainId];
  const defaultExplorer = process.env.NEXT_PUBLIC_BLOCKDAG_EXPLORER_URL || "https://awakening.bdagscan.com";
  if (!config) return `${defaultExplorer}/address/${address}`;
  return `${config.explorerUrl}/address/${address}`;
}
