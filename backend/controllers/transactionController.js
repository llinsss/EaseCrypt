import Transaction from "../models/Transaction.js";
import * as exchangerateapi from "../services/exchange-rate-api.js";
import * as freecryptoapi from "../services/free-crypto-api.js";
import * as flutterwave from "../services/flutterwave.js";
import * as paystack from "../services/paystack.js";
import { generateReference } from "../utils/reference.js";

// async function createOrGetCustomer(email, reference = null) {
//   const existing = await paystack.getCustomerByEmail(email);
//   if (existing) {
//     console.log("✅ Customer exists:", existing);
//     return existing;
//   }

//   const newCustomer = await paystack.createCustomer({ email, reference });
//   console.log("🎉 New customer created:", newCustomer);
//   return newCustomer;
// }

export const create = async (req, res) => {
  try {
    const { token, address, email, amount } = req.body;
    const getTokenRate = await freecryptoapi.rate(token);
    if (!getTokenRate?.last) {
      res.status(500).json({ error: "Failed to get the token rate" });
    }
    const getNGNRate = await exchangerateapi.rate("USD");
    if (!getNGNRate?.NGN) {
      res.status(500).json({ error: "Failed to fetch NGN/USD rate" });
    }
    const fee = 100;
    const ngn_rate = getNGNRate.NGN;
    const ngn_value = amount;
    const usd_value = (amount / ngn_rate).toFixed(6);
    const crypto_value = (usd_value / getTokenRate.last).toFixed(8);
    const reference = await generateReference(16);
    // const customer = await createOrGetCustomer(email, reference);
    // if (!customer?.customer_code) {
    //   res.status(500).json({ error: "Failed to create/fetch customer" });
    // }
    const bank_account = await flutterwave.createVirtualAccount({
      email,
      reference,
      amount: amount + fee,
    });
    if (!bank_account) {
      res.status(500).json({ error: "Failed to generate virtual account" });
    }
    const payload = {
      token,
      address,
      email,
      reference,
      status: "WAITING_FOR_PAYMENT",
      ngn_value,
      usd_value,
      crypto_value,
      bank_name: bank_account?.bank_name,
      account_reference: bank_account.flw_ref,
      account_name: "FLUTTERWAVE",
      account_number: bank_account?.account_number,
      amount: bank_account?.amount,
      remarks: "Transaction initiated",
      fee,
    };
    const data = await Transaction.create(payload);
    res.status(201).json({ reference });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const view = async (req, res) => {
  try {
    const { reference } = req.params;
    const data = await Transaction.findByReference(reference);
    if (!data) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { reference } = req.params;
    const transaction = await Transaction.findByReference(reference);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    const data = await Transaction.update(transaction.id, req.body);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const { reference } = req.params;
    const transaction = await Transaction.findByReference(reference);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    await Transaction.delete(transaction.id);
    res.json({ message: "Successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const allTransactionsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const data = await Transaction.findAllByEmail(email);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const recentTransactionsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const data = await Transaction.findRecentByEmail(email);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const latestTransactionByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const data = await Transaction.findLatestByEmail(email);
    res.json({ data: data ?? null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
