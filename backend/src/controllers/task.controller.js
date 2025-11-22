import prisma from "../config/prisma.js";
import { addActivity } from "./activity.controller.js";

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, dueDate, leadId, assigneeId, authorId } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
        leadId: leadId ? Number(leadId) : null,
        assigneeId: assigneeId ? Number(assigneeId) : null
      }
    });

    // Activity timeline entry
    if (leadId) {
      await addActivity(
        leadId,
        "note",
        null,
        `Task created: ${title}`,
        authorId,
        { taskId: task.id }
      );
    }

    // Notification for assignee
    if (assigneeId) {
      await prisma.notification.create({
        data: {
          userId: Number(assigneeId),
          type: "task_assigned",
          message: `You have been assigned a new task: ${title}`,
          payload: { taskId: task.id, leadId }
        }
      });
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL TASKS
export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        lead: true,
        assignee: true
      }
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET TASK BY ID
export const getTaskById = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        lead: true,
        assignee: true
      }
    });

    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const task = await prisma.task.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// MARK TASK COMPLETED
export const completeTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    const task = await prisma.task.update({
      where: { id: taskId },
      data: { completed: true }
    });

    // Activity timeline
    if (task.leadId) {
      await addActivity(
        task.leadId,
        "note",
        null,
        `Task completed: ${task.title}`,
        req.body.authorId,
        { taskId }
      );
    }

    res.json({ message: "Task completed", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    await prisma.task.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
