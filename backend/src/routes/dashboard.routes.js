import express from "express";
import { getDashboardSummary } from "../controllers/dashboard.controller.js";

const router = express.Router();

// GET /api/dashboard/summary
router.get("/summary", getDashboardSummary);

export default router;
