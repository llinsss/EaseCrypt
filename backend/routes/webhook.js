import express from "express";
import crypto from "node:crypto";
import dotenv from "dotenv";
dotenv.config();

import * as paystack from "../services/paystack.js";
import * as flutterwave from "../services/flutterwave.js";
import Transaction from "../models/Transaction.js";
import starknet from "../starknet-contract.js";

const router = express.Router();

// ✅ Paystack signature check
function verifyPaystackSignature(req) {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");
  return hash === req.headers["x-paystack-signature"];
}

// ✅ Flutterwave signature check
function verifyFlutterwaveSignature(req) {
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  const signature = req.headers["verif-hash"];
  if (!signature || !secretHash) return false;

  return signature === secretHash;
}

function isValidFlutterwaveWebhook(rawBody) {
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  const signature = req.headers["verif-hash"];
  const hash = crypto
    .createHmac("sha256", secretHash)
    .update(JSON.stringify(req.body))
    .digest("base64");

  return hash === signature;
}

export function toStarknetAmount(value, decimals = 18) {
  // Ensure value is a string to handle decimals accurately
  const valueStr = value.toString();
  // Split the value into integer and decimal parts
  const [integerPart, decimalPart = ""] = valueStr.split(".");
  // Pad the decimal part to the number of decimals
  const paddedDecimal = decimalPart.padEnd(decimals, "0").slice(0, decimals);
  // Combine integer and decimal parts
  const fullNumber = `${integerPart}${paddedDecimal}`;
  // Convert to BigInt
  const amountBigInt = BigInt(fullNumber);
  // Convert to u256 format for StarkNet
  return starknet.utils.bigIntToUint256(amountBigInt);
}

async function executeSTRKWithdraw(transaction) {
  try {
    const token_address = process.env.STARKNET_TOKEN_ADDRESS;
    const recipient_address = transaction.address;
    const amount = toStarknetAmount(transaction.crypto_value);

    console.log("Withdraw Inputs:", {
      token_address,
      recipient_address,
      amount,
    });

    const contract = await starknet.getContract();
    const nonce = await starknet.provider.getNonceForAddress(
      process.env.STARKNET_ACCOUNT_ADDRESS,
      { blockIdentifier: "latest" }
    );
    const tx = await contract.withdraw(
      token_address,
      recipient_address,
      amount,
      // { nonce }
    );
    await starknet.provider.waitForTransaction(tx.transaction_hash);

    console.log("✅ Starknet Transaction:", tx);
    await Transaction.update(transaction.id, {
      status: "COMPLETED",
      hash: tx.transaction_hash,
    });
  } catch (error) {
    console.error("❌ Withdraw failed:", error);
    // await Transaction.update(transaction.id, {
    //   status: "FAILED",
    //   hash: null,
    // });
    throw error;
  }
}

router.post("/paystack", async (req, res) => {
  if (!verifyPaystackSignature(req)) {
    return res.status(401).send("Invalid signature");
  }

  const event = req.body.event;
  const data = req.body.data;

  if (event === "charge.success") {
    console.log("✅ Payment received:", data.amount / 100, "NGN");
    console.log("Account Number:", data.authorization?.account_number);

    // 🔒 Verify transaction for safety
    const transaction = await paystack.verifyTransaction(data.reference);

    // Save to DB (here we just log)
    console.log("Verified transaction:", transaction);
  }

  res.sendStatus(200);
});

router.post("/flutterwave", async (req, res) => {
  const event = req.body.event;
  const data = req.body.data;

  if (event === "charge.completed" && data.status === "successful") {
    console.log("✅ Flutterwave:", data);
    const transaction = await Transaction.findByReference(data.tx_ref);
    if (transaction) {
      if (transaction.token === "STRK") {
        executeSTRKWithdraw(transaction);
      }
    }
  }

  res.sendStatus(200);
});
export default router;
