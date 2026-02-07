import express from "express";
import { getPolls, createPoll, addCandidateToPoll, voteForCandidate } from "../controllers/polls.controller.js";

const router = express.Router();

router.get("/polls", getPolls);
router.post("/create", createPoll);
router.post("/add-candidate", addCandidateToPoll);
router.post("/vote", voteForCandidate);

export default router;
