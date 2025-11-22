import express from "express";
import {
  createDeal,
  getDeals,
  getDealById,
  updateDeal,
  updateDealStatus,
  deleteDeal
} from "../controllers/deal.controller.js";

const router = express.Router();

router.post("/", createDeal);
router.get("/", getDeals);
router.get("/:id", getDealById);
router.put("/:id", updateDeal);
router.patch("/:id/status", updateDealStatus);
router.delete("/:id", deleteDeal);

export default router;
