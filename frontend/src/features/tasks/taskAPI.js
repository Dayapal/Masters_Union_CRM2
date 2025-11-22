import api from "../../api/axios";

// CREATE TASK
export const createTaskAPI = (data) => api.post("/tasks", data);

// GET ALL TASKS
export const getTasksAPI = () => api.get("/tasks");

// GET TASK BY ID
export const getTaskByIdAPI = (id) => api.get(`/tasks/${id}`);

// UPDATE TASK
export const updateTaskAPI = (id, data) => api.put(`/tasks/${id}`, data);

// DELETE TASK
export const deleteTaskAPI = (id) => api.delete(`/tasks/${id}`);

// GET TASKS BY LEAD
export const getTasksByLeadAPI = (leadId) => api.get(`/tasks/lead/${leadId}`);
