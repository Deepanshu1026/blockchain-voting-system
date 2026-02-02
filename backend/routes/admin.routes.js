import express from "express";
import { getCandidates, addCandidate } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/candidates", getCandidates);
router.post("/add-candidate", addCandidate);

export default router;
