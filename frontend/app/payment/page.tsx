"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Copy } from "lucide-react"
import { useState, useEffect } from "react"

export default function PaymentPage() {
  const [timeRemaining, setTimeRemaining] = useState(573) // 9:33 in seconds
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText("2085647391")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handlePaymentComplete = () => {
    // Randomly determine success or failure (80% success rate)
    const isSuccess = Math.random() > 0.2
    const status = isSuccess ? "success" : "failed"
    window.location.href = `/complete?status=${status}`
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-sm mx-auto bg-white border border-gray-200 rounded-3xl shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" className="p-2" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Payment Details</h1>
          </div>

          <div className="text-center">
            <div className="text-red-600 font-semibold text-lg">{formatTime(timeRemaining)} remaining</div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-gray-900">2085647391</div>
            <div className="text-gray-600">Providus Bank</div>
            <div className="text-gray-900 font-medium">EaseCrypt Payments</div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Transfer Instructions</h3>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex gap-3">
                <span className="font-semibold">1.</span>
                <span>Open your banking app or dial *737#</span>
              </div>

              <div className="flex gap-3">
                <span className="font-semibold">2.</span>
                <span>Transfer exactly ₦5,050</span>
              </div>

              <div className="flex gap-3">
                <span className="font-semibold">3.</span>
                <span>Use account number above</span>
              </div>

              <div className="flex gap-3">
                <span className="font-semibold">4.</span>
                <span>Click "I've Paid" after transfer</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
              onClick={handlePaymentComplete}
            >
              I've Made the Payment
            </Button>

            <Button
              variant="outline"
              className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 bg-transparent"
              onClick={copyAccountNumber}
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy Account Number"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
