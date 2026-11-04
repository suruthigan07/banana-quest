import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/games`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

export const createGame = async (data) => (await api.post("/", data)).data;
export const joinGame = async (roomCode) => (await api.post(`/${roomCode}/join`)).data;
export const getGame = async (roomCode) => (await api.get(`/${roomCode}`)).data;
export const startGame = async (roomCode) => (await api.post(`/${roomCode}/start`)).data;
export const submitAnswer = async (roomCode, selectedAnswerIndex) =>
  (await api.post(`/${roomCode}/answer`, { selectedAnswerIndex })).data;
export const nextQuestion = async (roomCode) => (await api.post(`/${roomCode}/next`)).data;
export const getGameAnswers = async (roomCode) => (await api.get(`/${roomCode}/answers`)).data;
