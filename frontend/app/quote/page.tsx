"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useTokenStore } from "@/lib/token-store"
import { useTheme } from "next-themes"

export default function QuotePage() {
  const { theme } = useTheme()
  const { tokenName, tokenSymbol, amount } = useTokenStore()

  const getTokenRate = (symbol: string) => {
    const rates = {
      ETH: 0.00123,
      BTC: 0.000045,
      USDC: 3.2,
      USDT: 3.18,
    }
    return rates[symbol as keyof typeof rates] || 0.00123
  }

  const cryptoAmount = getTokenRate(tokenSymbol)
  const networkFee = 50
  const totalCost = Number.parseInt(amount) + networkFee

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-sm mx-auto bg-white border border-gray-200 rounded-3xl shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" className="p-2" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Transaction Summary</h1>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-gray-900">
              ₦{Number(amount).toLocaleString()}
            </div>
            <div className="text-gray-600">
              You'll receive approximately
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {cryptoAmount} {tokenSymbol}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Transaction Details</h3>
            
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Exchange Rate</span>
                <span className="font-medium">1 {tokenSymbol} = ₦{(Number(amount) / cryptoAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Network Fee</span>
                <span className="font-medium">₦{networkFee}</span>
              </div>
              
              <div className="flex justify-between py-3 font-semibold border-t border-gray-100 mt-2">
                <span>Total Cost</span>
                <span>₦{totalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700 leading-relaxed">
              Exchange rates are live and may fluctuate. Final amount may vary slightly based on market conditions at time of payment confirmation.
            </p>
          </div>

          <Button className="w-full bg-black text-white hover:bg-gray-900 py-3 text-base font-medium rounded-lg shadow-md" asChild>
            <Link href="/payment">Continue to Payment</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
