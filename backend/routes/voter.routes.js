import express from "express";
import { verifyID, bindWallet, login } from "../controllers/voter.controller.js";

const router = express.Router();

router.post("/verify-id", verifyID);
router.post("/bind-wallet", bindWallet);
router.post("/login", login);

export default router;
