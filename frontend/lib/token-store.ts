import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenState {
  selectedToken: string;
  tokenName: string;
  tokenSymbol: string;
  amount: string;
  address: string;
  email: string;
  setToken: (token: string, name: string, symbol: string) => void;
  setAmount: (amount: string) => void;
  setAddress: (address: string) => void;
  setEmail: (email: string) => void;
  reset: () => void;
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      selectedToken: "ethereum",
      tokenName: "Ethereum",
      tokenSymbol: "ETH",
      amount: "5000",
      address: "",
      email: "",
      setToken: (token, name, symbol) =>
        set({ selectedToken: token, tokenName: name, tokenSymbol: symbol }),
      setAmount: (amount) => set({ amount }),
      setAddress: (address) => set({ address }),
      setEmail: (email) => set({ email }),
      reset: () =>
        set({
          selectedToken: "ethereum",
          tokenName: "Ethereum",
          tokenSymbol: "ETH",
          amount: "5000",
          address: "",
          email: "",
        }),
    }),
    {
      name: "crypto-ease-store",
    }
  )
);
