"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Moon, Sun, Database, AlertTriangle } from "lucide-react"
import { useTheme } from "next-themes"
import { useTokenStore } from "@/lib/token-store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function EaseCryptApp() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const {
    selectedToken,
    tokenName,
    tokenSymbol,
    amount,
    walletAddress,
    email,
    setToken,
    setAmount,
    setWalletAddress,
    setEmail,
  } = useTokenStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleTokenChange = (value: string) => {
    const tokens = {
      ethereum: { name: "Ethereum", symbol: "ETH" },
      bitcoin: { name: "Bitcoin", symbol: "BTC" },
      strk: { name: "STRK", symbol: "STRK" },
      usdt: { name: "Tether", symbol: "USDT" },
    }
    const token = tokens[value as keyof typeof tokens]
    setToken(value, token.name, token.symbol)
  }

  const handleGetQuote = () => {
    if (!amount || !walletAddress || !email) {
      alert("Please fill in all fields")
      return
    }
    router.push("/quote")
  }

  if (!mounted) {
    return (
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="bg-white px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">EaseCrypt</h1>
            <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full">
              <Moon className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
        <div className="p-6">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">EaseCrypt</h1>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
              <Moon className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-4">
          <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Database className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Buy Crypto Easily</h2>
          <p className="text-sm text-gray-600">
            Purchase cryptocurrency with fiat currency. No account needed.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Token</label>
            <Select value={selectedToken} onValueChange={handleTokenChange}>
            <SelectTrigger className="w-full h-12 px-4 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900">
                <SelectValue placeholder="Select a token" className="text-base" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg mt-1 py-1">
                <SelectItem
                  value="ethereum"
                  className="px-4 py-2 text-base hover:bg-gray-100 cursor-pointer"
                >
                  Ethereum (ETH)
                </SelectItem>
                <SelectItem
                  value="bitcoin"
                  className="px-4 py-2 text-base hover:bg-gray-100 cursor-pointer"
                >
                  Bitcoin (BTC)
                </SelectItem>
                <SelectItem
                  value="strk"
                  className="px-4 py-2 text-base hover:bg-gray-100 cursor-pointer"
                >
                  STRK
                </SelectItem>
                <SelectItem
                  value="usdt"
                  className="px-4 py-2 text-base hover:bg-gray-100 cursor-pointer"
                >
                  Tether (USDT)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount to send</label>
            <div className="relative">
              <Input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-base"
                placeholder="₦0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Wallet Address
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">where you want your tokens sent</p>
            <Input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="font-mono text-sm"
              placeholder="Enter wallet address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-700">
              Double-check your wallet address. Funds sent to wrong addresses cannot be recovered.
            </p>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2" onClick={handleGetQuote}>
            GET QUOTE
          </Button>
        </div>
      </div>
    </div>
  )
}
