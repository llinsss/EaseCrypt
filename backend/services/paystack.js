import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

const api = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

/**
 * ✅ Create Paystack customer with only email (other fields optional)
 */
export async function createCustomer(payload) {
  try {
    const res = await api.post("/customer", {
      email: payload.email,
      first_name: payload.firstname,
      last_name: payload.lastname,
      phone: payload.phone,
      metadata: { reference: payload.reference },
    });
    console.log("create customer:", res);
    return res.data.data;
  } catch (error) {
    console.log("Paystack Error:", error);
    return null;
  }
}

/**
 * ✅ Get customer by email (check if exists before creating)
 */
export async function getCustomerByEmail(email) {
  try {
    const res = await api.get(`/customer/${email}`);
    console.log("customers:", res);
    const customers = res.data.data;
    if (customers.length > 0) {
      return customers[0]; // return the first match
    }
    return null;
  } catch (error) {
    console.log("Paystack Error:", error);
    return null;
  }
}

/**
 * ✅ Create dedicated virtual account
 */
export async function createVirtualAccount(customerCode, bank = "wema-bank") {
  try {
    const res = await api.post("/dedicated_account", {
      customer: customerCode,
      preferred_bank: bank,
    });
    return res.data.data;
  } catch (error) {
    console.log("Paystack Error:", error);
    return null;
  }
}

/**
 * ✅ Verify transaction
 */
export async function verifyTransaction(reference) {
  try {
    const res = await api.get(`/transaction/verify/${reference}`);
    return res.data.data;
  } catch (error) {
    console.log("Paystack Error:", error);
    return null;
  }
}
