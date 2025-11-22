import express from "express";
import {
  createHistory,
  getHistoryForLead
} from "../controllers/history.controller.js";

const router = express.Router();

router.post("/", createHistory);

// Get all history for one lead
router.get("/lead/:leadId", getHistoryForLead);

export default router;
