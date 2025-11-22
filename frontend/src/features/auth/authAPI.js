
import api from "../../api/axios"; 

// LOGIN USER
export const loginAPI = (data) => api.post("/auth/login", data);

// REGISTER USER
export const registerAPI = (data) => api.post("/auth/register", data);

// GET CURRENT USER PROFILE (if needed)
export const getProfileAPI = () => api.get("/auth/me");
