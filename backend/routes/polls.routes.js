import express from "express";
import { getPolls, createPoll, addCandidateToPoll } from "../controllers/polls.controller.js";

const router = express.Router();

router.get("/polls", getPolls);
router.post("/create", createPoll);
router.post("/add-candidate", addCandidateToPoll);

export default router;
