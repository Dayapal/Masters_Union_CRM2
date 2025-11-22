import express from "express";
import {
  addNote,
  getNotesForLead,
  deleteNote
} from "../controllers/note.controller.js";

const router = express.Router();

router.post("/", addNote); // add note
router.get("/lead/:leadId", getNotesForLead); // get notes for lead
router.delete("/:id", deleteNote); // delete note

export default router;
