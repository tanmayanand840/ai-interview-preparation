import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getProgressSummary = async () =>
  await API.get("/practice/progress-summary");

export const getProblemsByTopic = async (topic) =>
  await API.get(`/practice/problems?topic=${topic}`);

export const updateProgress = async (data) =>
  await API.post("/practice/update-status", data);

export const addProblem = async (data) =>
  await API.post("/practice/problems", data);