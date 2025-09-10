import express from "express";
import {
  create,
  update,
  view,
  remove,
  allTransactionsByEmail,
  recentTransactionsByEmail,
  latestTransactionByEmail,
} from "../controllers/transactionController.js";
const router = express.Router();

router.post("/", create);
router.put("/:reference", update);
router.get("/:reference", view);
router.delete("/:reference", remove);
router.get("/all/:email", allTransactionsByEmail);
router.get("/recent/:email", recentTransactionsByEmail);
router.get("/latest/:email", latestTransactionByEmail);

export default router;
