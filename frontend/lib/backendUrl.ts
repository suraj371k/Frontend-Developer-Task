import axios from "axios";

export const api = axios.create({
  baseURL: "https://frontend-developer-task-ko2k.onrender.com",
  withCredentials: true,
});
