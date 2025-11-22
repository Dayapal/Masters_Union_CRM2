import prisma from "../config/prisma.js";
import { io } from "../server.js"; // socket.io server

/**
 * 🔥 Helper function to create a notification + emit in real-time
 */
export const createNotification = async (userId, type, message, payload = {}) => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,          // "task" | "lead" | "system"
      message,
      payload,
    },
  });

  // Emit to the specific user's room
  io.to(`user_${userId}`).emit("new_notification", notification);

  return notification;
};

/**
 * 🔥 GET all notifications for a user
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 🔥 GET only unread notifications
 */
export const getUnreadNotifications = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const unread = await prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(unread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 🔥 GET unread count (for showing 'badge count')
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 🔥 Mark a single notification as read
 */
export const markRead = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 🔥 Mark ALL notifications as read for a user
 */
export const markAllRead = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    res.json({
      message: "All notifications marked as read",
      updated: result.count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 🔥 Delete a notification
 */
export const deleteNotification = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.notification.delete({
      where: { id },
    });

    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
