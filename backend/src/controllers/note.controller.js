import prisma from "../config/prisma.js";
import { io } from "../server.js"; // for notifications

/**
 * ADD NOTE to a lead
 */
export const addNote = async (req, res) => {
  try {
    const { leadId, content, authorId } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Note content is required" });
    }

    const note = await prisma.note.create({
      data: {
        leadId: Number(leadId),
        content,
        authorId: authorId ? Number(authorId) : null,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    // Add Activity Timeline entry
    await prisma.activity.create({
      data: {
        type: "note",
        leadId: Number(leadId),
        authorId: authorId ? Number(authorId) : null,
        subject: "Note added",
        note: content,
        metadata: {},
      },
    });

    // Emit real-time update to UI (optional)
    io.emit("lead_note_added", note);

    res.status(201).json({
      message: "Note added successfully",
      note,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * GET all notes for a lead
 */
export const getNotesForLead = async (req, res) => {
  try {
    const leadId = Number(req.params.leadId);

    const notes = await prisma.note.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * DELETE note
 */
export const deleteNote = async (req, res) => {
  try {
    const noteId = Number(req.params.id);

    await prisma.note.delete({
      where: { id: noteId },
    });

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
