import { create } from "zustand"
import { persist } from "zustand/middleware"

interface TokenState {
  selectedToken: string
  tokenName: string
  tokenSymbol: string
  amount: string
  walletAddress: string
  email: string
  setToken: (token: string, name: string, symbol: string) => void
  setAmount: (amount: string) => void
  setWalletAddress: (address: string) => void
  setEmail: (email: string) => void
  reset: () => void
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      selectedToken: "ethereum",
      tokenName: "Ethereum",
      tokenSymbol: "ETH",
      amount: "5000",
      walletAddress: "",
      email: "",
      setToken: (token, name, symbol) => set({ selectedToken: token, tokenName: name, tokenSymbol: symbol }),
      setAmount: (amount) => set({ amount }),
      setWalletAddress: (address) => set({ walletAddress: address }),
      setEmail: (email) => set({ email }),
      reset: () =>
        set({
          selectedToken: "ethereum",
          tokenName: "Ethereum",
          tokenSymbol: "ETH",
          amount: "5000",
          walletAddress: "",
          email: "",
        }),
    }),
    {
      name: "crypto-ease-store",
    },
  ),
)
