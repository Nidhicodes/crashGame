// lib/axios.ts
import axios from "axios";
import { getCookie } from "./cookies";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("token"); 
    console.log("token is ",token);
    // get token from helper
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
