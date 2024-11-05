// FinanceTracker/src/api/config/axiosConfig.ts
import axios from "axios";
import AuthService from "../services/AuthService";

const apiClient = axios.create({
  baseURL: "http://localhost:5131/",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export default apiClient;
