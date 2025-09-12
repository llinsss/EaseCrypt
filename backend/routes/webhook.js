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
        const token_address = process.env.STARKNET_TOKEN_ADDRESS;
        const recipient_address = transaction.address;
        const amount = Number(Math.ceil(transaction.crypto_value));
        const contract = await starknet.getContract();
        const tx = await contract.withdraw(
          token_address,
          recipient_address,
          amount
        );
        await starknet.provider.waitForTransaction(tx.transaction_hash);
        console.log("✅ Starknet:", tx);
        await Transaction.update(transaction.id, {
          status: "COMPLETED",
          hash: null,
        });
      }
    }
  }

  res.sendStatus(200);
});
export default router;
