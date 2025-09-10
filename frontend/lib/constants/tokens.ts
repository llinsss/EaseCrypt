export const TOKENS = {
  ethereum: { name: "Ethereum", symbol: "ETH" },
  bitcoin: { name: "Bitcoin", symbol: "BTC" },
  strk: { name: "Starknet Token", symbol: "STRK" },
  usdt: { name: "Tether USDT", symbol: "USDT" },
} as const;

export type TokenKey = keyof typeof TOKENS;