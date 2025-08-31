"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckCircle, XCircle, Download, Share, HelpCircle, Loader2 } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import { useTokenStore } from "@/lib/token-store"

function TransactionCompleteContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const status = searchParams.get("status") || "success"
  const isSuccess = status === "success"
  const { tokenSymbol, amount, reset } = useTokenStore()

  // Simulate payment processing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000) // 3 second loading state
    
    return () => clearTimeout(timer)
  }, [])

  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

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
  const totalCost = Number.parseInt(amount) + 50

  const handleStartNew = () => {
    reset()
    window.location.href = "/"
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md sm:max-w-lg mx-auto bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl">
          <CardHeader className="pb-2 sm:pb-4 px-4 sm:px-6">
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Processing Payment
              </h1>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 py-6 sm:py-8">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 animate-spin" />
              <p className="text-sm sm:text-base text-gray-600 px-2">
                Processing your transaction. Please wait...
              </p>
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 sm:h-2.5">
                <div 
                  className="bg-blue-600 h-full rounded-full animate-pulse" 
                  style={{ width: '70%' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success/Failure state
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md sm:max-w-lg mx-auto bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl">
        <CardHeader className="pb-2 sm:pb-4 px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1.5 sm:p-2 -ml-2" 
              onClick={() => router.back()}
            >
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              {isSuccess ? 'Transaction Complete' : 'Transaction Failed'}
            </h1>
          </div>
          <div className="text-center space-y-3 sm:space-y-4 px-2">
            {isSuccess ? (
              <>
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-9 w-9 sm:h-12 sm:w-12 text-green-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Payment Successful!
                </h2>
                <p className="text-sm sm:text-base text-gray-600 px-2">
                  Your wallet has been credited with {cryptoAmount} {tokenSymbol}
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="h-9 w-9 sm:h-12 sm:w-12 text-red-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Transaction Failed
                </h2>
                <p className="text-sm sm:text-base text-gray-600 px-2">
                  Your payment could not be processed. Please try again.
                </p>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg px-1">
              Transaction Receipt
            </h3>

            <div className="space-y-2.5 text-sm bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm mb-0.5 sm:mb-0">Transaction ID</span>
                <span className="font-mono text-xs text-gray-900 bg-white px-2 py-1 rounded break-all text-right">
                  {transactionId}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Amount Paid</span>
                <span className="font-medium text-gray-900">
                  ₦{totalCost.toLocaleString()}
                </span>
              </div>

              {isSuccess && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Crypto Received</span>
                  <span className="font-medium text-gray-900">
                    {cryptoAmount} {tokenSymbol}
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2">
                <span className="text-gray-500 text-sm">Date & Time</span>
                <span className="font-medium text-gray-900 text-sm sm:text-base">
                  {currentDate} {currentTime}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="h-10 sm:h-11 text-xs sm:text-sm border border-gray-300 text-gray-700 font-medium rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-gray-50 transition-colors"
              >
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Download PDF</span>
              </Button>

              <Button
                variant="outline"
                className="h-10 sm:h-11 text-xs sm:text-sm border border-gray-300 text-gray-700 font-medium rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-gray-50 transition-colors"
              >
                <Share className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Share</span>
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full h-10 sm:h-11 text-xs sm:text-sm border border-gray-300 text-gray-700 font-medium rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-gray-50 transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>Help & Support</span>
            </Button>

            <Button
              className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium bg-black text-white rounded-lg shadow hover:bg-gray-800 transition-colors mt-2 sm:mt-4"
              onClick={handleStartNew}
            >
              Start New Transaction
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TransactionCompletePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionCompleteContent />
    </Suspense>
  )
}
