export interface Transaction {
  id?: number;
  token?: string;
  address?: string;
  email?: string;
  usd_value?: string;
  ngn_value?: string;
  crypto_value?: string;
  amount?: string;
  reference?: string;
  hash?: string | null;
  fee?: string;
  account_reference?: string;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  status?: "WAITING_FOR_PAYMENT" | "COMPLETED" | "FAILED" | string;
  remarks?: string;
  created_at?: string;
  updated_at?: string;
}
