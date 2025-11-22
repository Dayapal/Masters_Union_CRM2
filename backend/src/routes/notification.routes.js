import express from "express";

import {
  getNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

// GET all
router.get("/:userId", getNotifications);

// GET unread only
router.get("/:userId/unread", getUnreadNotifications);

// GET unread count
router.get("/:userId/unread/count", getUnreadCount);

// Mark single read
router.patch("/:id/read", markRead);

// Mark all read
router.patch("/:userId/read-all", markAllRead);

// Delete notification
router.delete("/:id", deleteNotification);

export default router;
