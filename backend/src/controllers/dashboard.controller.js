import prisma from "../config/prisma.js";

// Helper: start of today
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// DASHBOARD SUMMARY
export const getDashboardSummary = async (req, res) => {
  try {
    // ------- LEADS -------
    const totalLeads = await prisma.lead.count();

    const leadsByStatusRaw = await prisma.lead.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    const leadsByStatus = leadsByStatusRaw.reduce((acc, item) => {
      acc[item.status] = item._count._all;
      return acc;
    }, {});

    const newLeadsToday = await prisma.lead.count({
      where: {
        createdAt: {
          gte: startOfToday(),
        },
      },
    });

    // ------- DEALS -------
    const totalDeals = await prisma.deal.count();

    const dealsByStatusRaw = await prisma.deal.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    const dealsByStatus = dealsByStatusRaw.reduce((acc, item) => {
      acc[item.status] = item._count._all;
      return acc;
    }, {});

    const pipelineAmount = await prisma.deal.aggregate({
      where: { status: "open" },
      _sum: { amount: true },
    });

    const wonAmountAgg = await prisma.deal.aggregate({
      where: { status: "won" },
      _sum: { amount: true },
    });

    // ------- TASKS -------
    const openTasks = await prisma.task.count({
      where: { completed: false },
    });

    const completedTasks = await prisma.task.count({
      where: { completed: true },
    });

    const overdueTasks = await prisma.task.count({
      where: {
        completed: false,
        dueDate: {
          lt: new Date(),
        },
      },
    });

    // ------- RESPONSE -------
    res.json({
      leads: {
        total: totalLeads,
        byStatus: leadsByStatus,
        newToday: newLeadsToday,
      },
      deals: {
        total: totalDeals,
        byStatus: dealsByStatus,
        pipelineAmount: pipelineAmount._sum.amount || 0,
        wonAmount: wonAmountAgg._sum.amount || 0,
      },
      tasks: {
        open: openTasks,
        completed: completedTasks,
        overdue: overdueTasks,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
};
