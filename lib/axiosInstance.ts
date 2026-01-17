// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    const isEnglish = pathname.includes("en");
    const currentLocale = isEnglish ? "en" : "ar";

    config.headers['Locale'] = currentLocale;
    
    config.headers['Accept-Language'] = currentLocale;
  }
  return config;
});

export default api;