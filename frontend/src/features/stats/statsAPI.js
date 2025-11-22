import api from "../../api/axios";

// Fetch user dashboard stats (use your backend user-stats route)
export const getUserStatsAPI = (userId) => api.get(`/user-stats/${userId}`);
