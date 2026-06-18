// src/config/axios.js
import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:8000", // your backend port
  withCredentials: true,
});

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    const isAuthCheck = original.url === "/auth/me";
    const isRefreshCall = original.url === "/auth/refresh";

    // Don't retry session checks or refresh calls — just reject immediately
    if (error.response?.status === 401 && !original._retry && !isAuthCheck && !isRefreshCall) {
      original._retry = true;

      try {
        await API.post("/auth/refresh");
        return API(original); // retry original request
      } catch {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error); // let AuthContext .catch() handle it
  }
);