import api from "../../api/axios";

// GET ALL NOTIFICATIONS FOR A USER
export const getNotificationsAPI = (userId) =>
  api.get(`/notifications/${userId}`);

// GET ONLY UNREAD NOTIFICATIONS
export const getUnreadNotificationsAPI = (userId) =>
  api.get(`/notifications/${userId}/unread`);

// MARK ONE NOTIFICATION AS READ
export const markAsReadAPI = (id) =>
  api.patch(`/notifications/${id}/read`);

// MARK ALL AS READ
export const markAllAsReadAPI = (userId) =>
  api.patch(`/notifications/${userId}/read-all`);

// DELETE NOTIFICATION
export const deleteNotificationAPI = (id) =>
  api.delete(`/notifications/${id}`);
