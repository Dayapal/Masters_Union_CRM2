import express from "express";
import { getUserStats } from "../controllers/userStats.controller.js";

const router = express.Router();

// /api/user-stats/:userId
router.get("/:userId", getUserStats);

export default router;
