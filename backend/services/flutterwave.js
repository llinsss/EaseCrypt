import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

const api = axios.create({
  baseURL: "https://api.flutterwave.com/v3",
  headers: {
    Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * ✅ Create virtual account
 */
export async function createVirtualAccount(payload) {
  try {
    const res = await api.post("/virtual-account-numbers", {
      amount: payload.amount,
      email: payload.email,
      narration: "payment from easecrypt",
      tx_ref: payload.reference,
      firstname: "easecrypt",
      lastname: "user",
      phonenumber: "",
    });
    return res?.data?.data ?? null;
  } catch (error) {
    console.log("Flutterwave Error:", error);
    return null;
  }
}

/**
 * ✅ Verify transaction
 */
export async function verifyTransaction(id) {
  try {
    const res = await api.get(`/transactions/${id}/verify`);
    return res.data.data;
  } catch (error) {
    console.log("Flutterwave Error:", error);
    return null;
  }
}
