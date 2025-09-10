import express from "express";
import { profile, userByEmail } from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, profile);
router.get("/:email", userByEmail);

export default router;
