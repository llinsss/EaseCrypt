"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sun, Database, AlertTriangle } from "lucide-react";
import { TOKENS, TokenKey } from "@/lib/constants/tokens";
import { FiatRates, CryptoRates } from "@/lib/types/rates";
import {
  fetchFiatRate,
  fetchCryptoRate,
  formatConversion,
} from "@/lib/utils/rates";
import { apiClient } from "@/lib/api";

export function EaseCryptApp() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [fiatRate, setFiatRate] = useState<FiatRates | null>(null);
  const [cryptoRate, setCryptoRate] = useState<CryptoRates | null>(null);
  const [fiatRateLoading, setFiatRateLoading] = useState(true);
  const [cryptoRateLoading, setCryptoRateLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>(10000);
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<TokenKey>("strk");

  const router = useRouter();

  // Hydration safety
  useEffect(() => setMounted(true), []);

  const handleTokenChange = (value: TokenKey) => {
    setToken(value);
  };

  const handleGetQuote = async () => {
    if (!amount || !address || !email) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    const data = await apiClient.post<Record<string, string>>("/transactions", {
      amount,
      address,
      email,
      token: TOKENS[token].symbol,
    });
    if (data?.reference) {
      router.push(`/quote/${data.reference}`);
    } else {
      toast.error("Unable to initiate transaction, please try again..");
    }
    setLoading(false);
  };

  // Fiat rate fetch
  useEffect(() => {
    (async () => {
      setFiatRateLoading(true);
      const data = await fetchFiatRate();
      if (!data) toast.error("Failed to fetch fiat rate");
      setFiatRate(data);
      setFiatRateLoading(false);
    })();
  }, []);

  // Crypto rate fetch
  useEffect(() => {
    if (!token) return;
    (async () => {
      setCryptoRateLoading(true);
      const data = await fetchCryptoRate(token);
      if (!data) toast.error("Failed to fetch crypto rate");
      setCryptoRate(data);
      setCryptoRateLoading(false);
    })();
  }, [token]);

  if (!mounted) {
    return (
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="bg-white px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">EaseCrypt</h1>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Moon className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
        <div className="p-6">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">EaseCrypt</h1>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-full"
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

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Database className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Buy Crypto Easily
          </h2>
          <p className="text-sm text-gray-600">
            Purchase cryptocurrency with fiat currency. No account needed.
          </p>
        </div>
        {/* Token selection */}
        <div className="space-y-2">
          <label
            htmlFor="token"
            className="block text-sm font-medium text-gray-700"
          >
            Select Token
          </label>
          <Select value={token} onValueChange={handleTokenChange}>
            <SelectTrigger className="w-full h-12 px-4 py-2 text-base border border-gray-300 rounded-md shadow-sm bg-white text-gray-900">
              <SelectValue placeholder="Select a token" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg mt-1 py-1">
              {Object.entries(TOKENS).map(([key, token]) => (

                <SelectItem
                  key={key}
                  value={key}
                  className="px-4 py-2 text-base"
                >
                  {token.name} ({token.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="w-full flex justify-end text-sm text-gray-600">
            {token &&
            cryptoRate?.symbol.includes(TOKENS[token].symbol) &&
            !cryptoRateLoading
              ? `1 ${TOKENS[token].symbol} = ${cryptoRate?.last} USD`
              : "Fetching rate..."}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Amount to send
          </label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="text-base"
            placeholder="₦0.00"
          />
          {!fiatRateLoading && (
            <div className="w-full flex justify-end text-sm text-gray-600">
              {formatConversion(
                amount,
                fiatRate,
                cryptoRate,
                TOKENS[token].symbol
              )}
            </div>
          )}
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Wallet Address
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Where you want your tokens sent
          </p>
          <Input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="font-mono text-sm"
            placeholder={`Enter ${TOKENS[token].symbol} wallet address`}
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-yellow-700">
            Double-check your wallet address. Funds sent to wrong addresses
            cannot be recovered.
          </p>
        </div>

        {/* CTA */}
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
          onClick={handleGetQuote}
          disabled={cryptoRateLoading || fiatRateLoading || loading}
        >
          {loading ? "Processing..." : "GET QUOTE"}
        </Button>
      </div>
    </div>
  );
}
