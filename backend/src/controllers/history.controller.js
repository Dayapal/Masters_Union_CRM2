import prisma from "../config/prisma.js";

/**
 * CREATE a history entry manually (rarely used — usually auto-generated)
 */
export const createHistory = async (req, res) => {
  try {
    const { leadId, changedById, oldValue, newValue, action } = req.body;

    const history = await prisma.leadHistory.create({
      data: {
        leadId: Number(leadId),
        changedById: changedById ? Number(changedById) : null,
        oldValue,
        newValue,
        action,
      },
    });

    res.status(201).json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET all history for a Lead
 */
export const getHistoryForLead = async (req, res) => {
  try {
    const leadId = Number(req.params.leadId);

    const history = await prisma.leadHistory.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
      include: {
        changedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
