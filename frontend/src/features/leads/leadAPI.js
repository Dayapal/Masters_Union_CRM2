import api from "../../api/axios";

// CREATE LEAD
export const createLeadAPI = (data) => api.post("/leads", data);

// GET ALL LEADS
export const getLeadsAPI = () => api.get("/leads");

// GET SINGLE LEAD
export const getLeadByIdAPI = (id) => api.get(`/leads/${id}`);

// UPDATE LEAD
export const updateLeadAPI = (id, data) => api.put(`/leads/${id}`, data);

// DELETE LEAD
export const deleteLeadAPI = (id) => api.delete(`/leads/${id}`);

// ASSIGN LEAD TO USER
export const assignLeadAPI = (id, data) => api.patch(`/leads/${id}/assign`, data);

// UPDATE STATUS
export const updateLeadStatusAPI = (id, data) => api.patch(`/leads/${id}/status`, data);

// ADD NOTE
export const addLeadNoteAPI = (id, data) => api.post(`/leads/${id}/notes`, data);
