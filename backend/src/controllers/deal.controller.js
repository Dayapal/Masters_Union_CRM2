import prisma from "../config/prisma.js";
import { addActivity } from "./activity.controller.js";

// CREATE DEAL
export const createDeal = async (req, res) => {
  try {
    const { title, amount, status, leadId, authorId } = req.body;

    const deal = await prisma.deal.create({
      data: {
        title,
        amount: Number(amount),
        status: status || "open",
        leadId: leadId ? Number(leadId) : null
      }
    });

    // Activity: Deal created
    if (leadId) {
      await addActivity(
        leadId,
        "note",
        null,
        `Deal created: ${title} (₹${amount})`,
        authorId,
        { dealId: deal.id }
      );
    }

    res.status(201).json(deal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL DEALS
export const getDeals = async (req, res) => {
  try {
    const deals = await prisma.deal.findMany({
      include: { lead: true }
    });

    res.json(deals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET DEAL BY ID
export const getDealById = async (req, res) => {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: Number(req.params.id) },
      include: { lead: true }
    });

    if (!deal) return res.status(404).json({ error: "Deal not found" });

    res.json(deal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE DEAL
export const updateDeal = async (req, res) => {
  try {
    const { authorId } = req.body;

    const deal = await prisma.deal.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });

    // Add activity when editing deal
    if (deal.leadId) {
      await addActivity(
        deal.leadId,
        "note",
        null,
        `Deal updated: ${deal.title}`,
        authorId,
        req.body
      );
    }

    res.json(deal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// MARK DEAL AS WON / LOST
export const updateDealStatus = async (req, res) => {
  try {
    const dealId = Number(req.params.id);
    const { status, authorId } = req.body;

    if (!["open", "won", "lost"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const deal = await prisma.deal.findUnique({ where: { id: dealId } });
    if (!deal) return res.status(404).json({ error: "Deal not found" });

    const updatedDeal = await prisma.deal.update({
      where: { id: dealId },
      data: { status }
    });

    if (deal.leadId) {
      await addActivity(
        deal.leadId,
        "status_change",
        null,
        `Deal ${status.toUpperCase()}: ${deal.title}`,
        authorId,
        { amount: deal.amount }
      );
    }

    res.json(updatedDeal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE DEAL
export const deleteDeal = async (req, res) => {
  try {
    await prisma.deal.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({ message: "Deal deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
