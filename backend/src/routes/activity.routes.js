import express from "express";
import { getActivitiesByLead } from "../controllers/activity.controller.js";

const router = express.Router();

// GET /api/activity/lead/:leadId
router.get("/lead/:leadId", getActivitiesByLead);

export default router;
