import express from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  assignLead,
  updateLeadStatus,
  addLeadNote
} from "../controllers/lead.controller.js";

import {
  verifyToken,
  requireRole,
  requireOwnershipOrRole
} from "../middleware/auth.middleware.js";

const router = express.Router();

// ------------------------------------------------------------
// ALL LEAD ROUTES REQUIRE LOGIN
// ------------------------------------------------------------
router.use(verifyToken);

// ------------------------------------------------------------
// CREATE LEAD → Only admin & manager
// ------------------------------------------------------------
router.post("/", requireRole("admin", "manager"), createLead);

// ------------------------------------------------------------
// GET ALL LEADS → admin & manager see all, sales sees only theirs
// ------------------------------------------------------------
router.get("/", getLeads);

// ------------------------------------------------------------
// GET SINGLE LEAD → admin/manager OR owner
// ------------------------------------------------------------
router.get(
  "/:id",
  requireOwnershipOrRole("lead", "ownerId"),
  getLeadById
);

// ------------------------------------------------------------
// UPDATE LEAD → admin/manager OR owner
// ------------------------------------------------------------
router.put(
  "/:id",
  requireOwnershipOrRole("lead", "ownerId"),
  updateLead
);

// ------------------------------------------------------------
// DELETE LEAD → admin only
// ------------------------------------------------------------
router.delete("/:id", requireRole("admin"), deleteLead);

// ------------------------------------------------------------
// ASSIGN LEAD → admin or manager only
// ------------------------------------------------------------
router.patch("/:id/assign", requireRole("admin", "manager"), assignLead);

// ------------------------------------------------------------
// UPDATE STATUS → admin/manager OR owner
// ------------------------------------------------------------
router.patch(
  "/:id/status",
  requireOwnershipOrRole("lead", "ownerId"),
  updateLeadStatus
);

// ------------------------------------------------------------
// ADD NOTE → admin/manager OR owner
// ------------------------------------------------------------
router.post(
  "/:id/notes",
  requireOwnershipOrRole("lead", "ownerId"),
  addLeadNote
);

export default router;
