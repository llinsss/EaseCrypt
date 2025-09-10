import { apiClient } from "@/lib/api";
import { FiatRates, CryptoRates } from "@/lib/types/rates";
import { TOKENS, TokenKey } from "@/lib/constants/tokens";

export async function fetchFiatRate(): Promise<FiatRates | null> {
  try {
    return await apiClient.get<FiatRates>("/fiat-rate?currency=USD");
  } catch {
    return null;
  }
}

export async function fetchCryptoRate(
  tokenKey: TokenKey
): Promise<CryptoRates | null> {
  try {
    const token = TOKENS[tokenKey];
    return await apiClient.get<CryptoRates>(
      `/crypto-rate?token=${token.symbol}`
    );
  } catch {
    return null;
  }
}

export function formatConversion(
  amount: number,
  fiatRate: FiatRates | null,
  cryptoRate: CryptoRates | null,
  tokenSymbol: string
): string {
  if (!fiatRate || !amount) return "";

  const usd = Number(amount) / Number(fiatRate.NGN);
  let result = `${amount} NGN = ${usd.toFixed(3)} USD`;

  if (cryptoRate) {
    const tokenValue = (usd / Number(cryptoRate.last)).toFixed(7);
    result += ` = ${tokenValue} ${tokenSymbol}`;
  }

  return result;
}
