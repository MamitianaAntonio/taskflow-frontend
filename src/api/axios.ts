import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

type RetryConfig = InternalAxiosRequestConfig & { __networkRetry?: boolean };

// Generation of a cold Render instance can easily exceed the default timeout.
const REQUEST_TIMEOUT = 45000;

// POSTs are only retried when replaying them cannot create duplicates.
const REPLAYABLE_POSTS = ["/api/users/login", "/api/auth/google"];

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: REQUEST_TIMEOUT,
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

const shouldRetry = (error: AxiosError): boolean => {
  const config = error.config as RetryConfig | undefined;
  if (!config || config.__networkRetry) return false;
  // A response means the server is awake: this is a real answer, not a
  // cold-start failure.
  if (error.response || error.code === "ERR_CANCELED") return false;

  const method = (config.method ?? "get").toLowerCase();
  if (method === "get" || method === "head") return true;

  return REPLAYABLE_POSTS.some((path) => config.url?.startsWith(path));
};

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!shouldRetry(error)) return Promise.reject(error);

    const config = error.config as RetryConfig;
    config.__networkRetry = true;
    return axiosClient.request(config);
  },
);

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
