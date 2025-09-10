"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { Transaction } from "@/lib/types/transaction";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface QuoteReferencePageProps {
  params: {
    reference: string;
  };
}
export default function QuoteReferencePage({
  params,
}: QuoteReferencePageProps) {
  const reference = params.reference;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch transaction
  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await apiClient.get<Record<"data", Transaction>>(
        `/transactions/${reference}`
      );
      if (!response.data) {
        toast.error("Failed to fetch transaction");
      }
      if (response.data.status !== "WAITING_FOR_PAYMENT") {
        window.location.assign(`/complete/${reference}`);
      }
      setTransaction(response.data);
      setLoading(false);
    })();
  }, [reference]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-sm mx-auto bg-white border border-gray-200 rounded-3xl shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              Transaction Summary
            </h1>
          </div>
        </CardHeader>

        {loading ? (
          <div className="w-full h-auto min-h-[320px] text-center items-center justify-center text-sm font-normal text-gray-600">
            Loading transaction data, please wait..
          </div>
        ) : (
          <CardContent className="space-y-6 p-6">
            <div className="text-center space-y-4">
              <div className="text-3xl font-bold text-gray-900">
                ₦{Number(transaction?.ngn_value).toLocaleString()}
              </div>
              <div className="text-gray-600">You'll receive approximately</div>
              <div className="text-2xl font-bold text-gray-900">
                {transaction?.crypto_value} {transaction?.token}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                Transaction Details
              </h3>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Exchange Rate</span>
                  <span className="font-medium">
                    1 {transaction?.token} = ₦
                    {(
                      Number(transaction?.ngn_value) /
                      Number(transaction?.crypto_value)
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Network Fee</span>
                  <span className="font-medium">
                    ₦
                    {(
                      Number(transaction?.amount) -
                      Number(transaction?.ngn_value)
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between py-3 font-semibold border-t border-gray-100 mt-2">
                  <span>Total Cost</span>
                  <span>₦{Number(transaction?.amount).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-700 leading-relaxed">
                Exchange rates are live and may fluctuate. Final amount may vary
                slightly based on market conditions at time of payment
                confirmation.
              </p>
            </div>

            {transaction?.status === "WAITING_FOR_PAYMENT" && (
              <Button
                className="w-full bg-black text-white hover:bg-gray-900 py-3 text-base font-medium rounded-lg shadow-md"
                asChild
              >
                <Link href={`/payment/${reference}`}>Continue to Payment</Link>
              </Button>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
