import axios, { AxiosError } from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      fallback
    );
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export default axiosClient;