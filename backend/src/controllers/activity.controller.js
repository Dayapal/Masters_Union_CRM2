import prisma from "../config/prisma.js";

// Helper function used by all modules (leads, tasks, notes etc.)
export const addActivity = async (leadId, type, note, subject, authorId, metadata = {}) => {
  try {
    return await prisma.activity.create({
      data: {
        type,
        note,
        subject,
        leadId,
        authorId: authorId ? Number(authorId) : null,
        metadata
      }
    });
  } catch (err) {
    console.error("Activity Error:", err.message);
  }
};

// GET ACTIVITIES FOR A LEAD
export const getActivitiesByLead = async (req, res) => {
  try {
    const leadId = Number(req.params.leadId);

    const activities = await prisma.activity.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
