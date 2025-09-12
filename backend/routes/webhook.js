import express from "express";
import crypto from "node:crypto";
import dotenv from "dotenv";
dotenv.config();

import * as paystack from "../services/paystack.js";
import * as flutterwave from "../services/flutterwave.js";
import Transaction from "../models/Transaction.js";

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
    console.log("✅ Flutterwave Payment received:", data);
    // console.log("Customer:", data.customer?.email);
    // const transaction = await flutterwave.verifyTransaction(data.id);
    // console.log("Verified transaction:", transaction);
    const transaction = await Transaction.findByReference(data.tx_ref);
    if (transaction) {
      if(transaction.token === "STRK"){
        
      }
      await Transaction.update(transaction.id, { status: "COMPLETED" });
    }
  }

  res.sendStatus(200);
});
export default router;
