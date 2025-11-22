// src/features/dashboard/dashboardAPI.js

import api from "../../api/axios";   // correct axios instance

export const fetchDashboardStatsAPI = async (userId) => {
  return await api.get(`/user-stats/${userId}`);
};
