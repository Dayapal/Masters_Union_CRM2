import prisma from "../config/prisma.js";
import { addActivity } from "./activity.controller.js";   // ⭐ IMPORTANT

// CREATE LEAD
export const createLead = async (req, res) => {
  try {
    const { title, name, email, phone, source, value, status, ownerId, authorId } = req.body;

    const lead = await prisma.lead.create({
      data: {
        title,
        name,
        email,
        phone,
        source,
        value,
        status: status || "new",
        ownerId: ownerId ? Number(ownerId) : null
      }
    });

    // ⭐ Timeline: Lead Created
    await addActivity(
      lead.id,
      "note",
      null,
      `Lead created: ${lead.title}`,
      authorId,
      { value }
    );

    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL LEADS
export const getLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        owner: true,
        notes: true,
        tasks: true,
        activities: true,
      }
    });

    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE LEAD
export const getLeadById = async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        owner: true,
        notes: true,
        tasks: true,
        activities: true,
        history: true,
        emails: true,
      }
    });

    if (!lead) return res.status(404).json({ error: "Lead not found" });

    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE LEAD
export const updateLead = async (req, res) => {
  try {
    const lead = await prisma.lead.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });

    // ⭐ Timeline: Lead updated
    await addActivity(
      lead.id,
      "note",
      null,
      "Lead details updated",
      req.body.authorId || null,
      req.body
    );

    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE LEAD
export const deleteLead = async (req, res) => {
  try {
    const lead = await prisma.lead.delete({
      where: { id: Number(req.params.id) }
    });

    // ⭐ Timeline: Lead deleted
    await addActivity(
      lead.id,
      "note",
      null,
      `Lead deleted: ${lead.title}`,
      null
    );

    res.json({ message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ASSIGN LEAD TO USER
export const assignLead = async (req, res) => {
  try {
    const leadId = Number(req.params.id);
    const { ownerId, authorId } = req.body;

    if (!ownerId) return res.status(400).json({ error: "ownerId is required" });

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: Number(ownerId) }
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: { ownerId: Number(ownerId) },
      include: { owner: true }
    });

    // ⭐ Timeline: Lead assigned
    await addActivity(
      leadId,
      "note",
      null,
      `Lead assigned to ${user.name}`,
      authorId,
      { ownerId }
    );

    res.json({
      message: "Lead assigned successfully",
      lead
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE LEAD STATUS + SAVE HISTORY
export const updateLeadStatus = async (req, res) => {
  try {
    const leadId = Number(req.params.id);
    const { status, changedById } = req.body;

    if (!status) return res.status(400).json({ error: "Status is required" });

    const validStatuses = ["new","contacted","qualified","proposal","won","lost"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Get old lead
    const oldLead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!oldLead) return res.status(404).json({ error: "Lead not found" });

    // Update status
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: { status }
    });

    // Save history
    await prisma.leadHistory.create({
      data: {
        leadId,
        changedById: Number(changedById) || null,
        oldValue: oldLead.status,
        newValue: status,
        action: "STATUS_UPDATE"
      }
    });

    // ⭐ Timeline: Status change
    await addActivity(
      leadId,
      "status_change",
      null,
      `Status changed from ${oldLead.status} → ${status}`,
      changedById,
      { old: oldLead.status, new: status }
    );

    res.json({
      message: "Lead status updated",
      lead: updatedLead
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD NOTE TO LEAD
export const addLeadNote = async (req, res) => {
  try {
    const leadId = Number(req.params.id);
    const { content, authorId } = req.body;

    if (!content) return res.status(400).json({ error: "Content is required" });

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    const note = await prisma.note.create({
      data: {
        content,
        leadId,
        authorId: authorId ? Number(authorId) : null
      }
    });

    // ⭐ Timeline: Note added
    await addActivity(
      leadId,
      "note",
      content,
      "Note added",
      authorId
    );

    res.status(201).json({
      message: "Note added",
      note
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
