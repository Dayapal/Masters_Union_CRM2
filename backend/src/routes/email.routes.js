import express from "express";
import {
  sendEmail,
  receiveEmail,
  getEmailsForLead,
  getEmailById,
  deleteEmail,
} from "../controllers/email.controller.js";

const router = express.Router();

router.post("/send", sendEmail);
router.post("/receive", receiveEmail);

router.get("/lead/:leadId", getEmailsForLead);
router.get("/:id", getEmailById);

router.delete("/:id", deleteEmail);

export default router;
