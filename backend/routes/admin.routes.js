import express from "express";
import { getCandidates, addCandidate, deleteCandidate } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/candidates", getCandidates);
router.post("/add-candidate", addCandidate);
router.delete("/candidates/:id", deleteCandidate);

export default router;
