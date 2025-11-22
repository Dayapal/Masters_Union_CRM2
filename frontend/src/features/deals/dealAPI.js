// src/api/dealAPI.js
import base from "../../api/axios"; // <-- your axios instance (see note)



export const fetchDealsAPI = async () => {
  const res = await axios.get(base);
  return res.data;
};

export const fetchDealByIdAPI = async (id) => {
  const res = await axios.get(`${base}/${id}`);
  return res.data;
};

export const createDealAPI = async (payload) => {
  const res = await axios.post(base, payload);
  return res.data;
};

export const updateDealAPI = async ({ id, data }) => {
  const res = await axios.put(`${base}/${id}`, data);
  return res.data;
};

// change status (won/lost/open) — adjust endpoint if your backend uses different path
export const changeDealStatusAPI = async ({ id, status, authorId }) => {
  const res = await axios.patch(`${base}/${id}/status`, { status, authorId });
  return res.data;
};

export const addDealNoteAPI = async ({ id, data }) => {
  const res = await axios.post(`${base}/${id}/notes`, data);
  return res.data;
};

export const deleteDealAPI = async (id) => {
  const res = await axios.delete(`${base}/${id}`);
  return res.data;
};
