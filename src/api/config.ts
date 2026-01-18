import axios from "axios";
import { loadTokenFromStorage } from "../utils/token";

const api = axios.create({
    baseURL:'http://192.168.1.153:8080/admin',
    timeout: 10000,
})

// Interceptor gắn JWT cho tất cả request
api.interceptors.request.use(async (config) => {
  const token = await loadTokenFromStorage();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;