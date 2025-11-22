import prisma from "../config/prisma.js";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getUserStats = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const totalLeads = await prisma.lead.count({
      where: { ownerId: userId }
    });

    const leadsByStatusRaw = await prisma.lead.groupBy({
      by: ["status"],
      where: { ownerId: userId },
      _count: { _all: true }
    });

    const leadsByStatus = leadsByStatusRaw.reduce((acc, i) => {
      acc[i.status] = i._count._all;
      return acc;
    }, {});

    const deals = await prisma.deal.findMany({
      where: { lead: { ownerId: userId } }
    });

    const totalDeals = deals.length;

    const dealWonSum = deals
      .filter(d => d.status === "won")
      .reduce((sum, d) => sum + d.amount, 0);

    const openTasks = await prisma.task.count({
      where: { assigneeId: userId, completed: false }
    });

    const completedTasks = await prisma.task.count({
      where: { assigneeId: userId, completed: true }
    });

    const overdueTasks = await prisma.task.count({
      where: {
        assigneeId: userId,
        completed: false,
        dueDate: { lt: new Date() }
      }
    });

    const todayActivities = await prisma.activity.count({
      where: {
        authorId: userId,
        createdAt: { gte: startOfToday() }
      }
    });

    res.json({
      userId,
      leads: {
        total: totalLeads,
        byStatus: leadsByStatus
      },
      deals: {
        total: totalDeals,
        wonAmount: dealWonSum
      },
      tasks: {
        open: openTasks,
        completed: completedTasks,
        overdue: overdueTasks
      },
      activitiesToday: todayActivities
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
