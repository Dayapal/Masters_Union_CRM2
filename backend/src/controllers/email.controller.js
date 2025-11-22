import prisma from "../config/prisma.js";
import { io } from "../server.js";

/**
 * Send an outbound email (store in DB + notify user)
 */
export const sendEmail = async (req, res) => {
  try {
    const { leadId, subject, body, to, from, metadata } = req.body;

    const email = await prisma.email.create({
      data: {
        direction: "outbound",
        subject,
        body,
        to,
        from,
        metadata: metadata || {},
        sentAt: new Date(),
        leadId: leadId ? Number(leadId) : null,
      },
    });

    // Activity timeline entry
    await prisma.activity.create({
      data: {
        type: "email",
        leadId: Number(leadId),
        authorId: req.body.authorId || null,
        subject: `Email sent: ${subject || "No Subject"}`,
        note: body.substring(0, 100) + "...",
        metadata: { to, from },
      },
    });

    // Emit socket notification
    io.emit("email_sent", email);

    res.status(201).json({
      message: "Email saved and activity logged",
      email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * Store inbound email (e.g., customer replied)
 */
export const receiveEmail = async (req, res) => {
  try {
    const { leadId, subject, body, to, from, metadata } = req.body;

    const email = await prisma.email.create({
      data: {
        direction: "inbound",
        subject,
        body,
        to,
        from,
        metadata: metadata || {},
        sentAt: new Date(),
        leadId: leadId ? Number(leadId) : null,
      },
    });

    // Add to activity timeline
    await prisma.activity.create({
      data: {
        type: "email",
        leadId: Number(leadId),
        authorId: null,
        subject: `Inbound Email: ${subject || "No Subject"}`,
        note: body.substring(0, 100) + "...",
        metadata: { from, to },
      },
    });

    io.emit("email_received", email);

    res.status(201).json({
      message: "Inbound email stored",
      email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * Get all emails for a lead
 */
export const getEmailsForLead = async (req, res) => {
  try {
    const leadId = Number(req.params.leadId);

    const emails = await prisma.email.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
    });

    res.json(emails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * Get a single email
 */
export const getEmailById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const email = await prisma.email.findUnique({ where: { id } });

    if (!email) return res.status(404).json({ error: "Email not found" });

    res.json(email);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * Delete an email
 */
export const deleteEmail = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.email.delete({ where: { id } });

    res.json({ message: "Email deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
