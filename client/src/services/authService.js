import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

export const registerUser = async (data) => (await api.post("/auth/register", data)).data;
export const loginUser = async (data) => (await api.post("/auth/login", data)).data;
export const getCurrentUser = async () => (await api.get("/auth/me")).data;
export const logoutUser = async () => (await api.post("/auth/logout")).data;
export const updateUserProfile = async (data) => (await api.put("/auth/profile", data)).data;
export const getLeaderboard = async () => (await api.get("/auth/leaderboard")).data;

export const socialLoginUrl = (provider) => {
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return `${base}/auth/${provider}`;
};
