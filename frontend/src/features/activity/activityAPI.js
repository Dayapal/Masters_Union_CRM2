import api from "../../api/axios";

// GET TIMELINE OF A LEAD
export const getActivityByLeadAPI = (leadId) =>
  api.get(`/activity/lead/${leadId}`);

// ADD NOTE
export const addNoteAPI = (leadId, data) =>
  api.post(`/activity/${leadId}/note`, data);

// CHANGE STATUS
export const addStatusChangeAPI = (leadId, data) =>
  api.post(`/activity/${leadId}/status-change`, data);
