import express from "express";
import { verifyID, bindWallet } from "../controllers/voter.controller.js";

const router = express.Router();

router.post("/verify-id", verifyID);
router.post("/bind-wallet", bindWallet);

export default router;
