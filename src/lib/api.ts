import axios from "axios";
import { Config } from "@/config/config";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const api = axios.create({
  baseURL: Config.API_URL,
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshEndpoint = originalRequest.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshEndpoint) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = api
            .post("/auth/refresh")
            .then(() => undefined)
            .finally(() => {
              refreshPromise = null;
            });
        }
        await refreshPromise;
        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export async function get<T>(url: string): Promise<T | undefined> {
  try {
    const response = await api.get<T>(url);
    return response.data;
  } catch {
    return undefined;
  }
}

export async function post<T>(url: string, data?: unknown): Promise<T | undefined> {
  try {
    const response = await api.post<T>(url, data);
    return response.data;
  } catch {
    return undefined;
  }
}

export async function patch<T>(url: string, data?: unknown): Promise<T | undefined> {
  try {
    const response = await api.patch<T>(url, data);
    return response.data;
  } catch {
    return undefined;
  }
}

export async function del<T>(url: string): Promise<T | undefined> {
  try {
    const response = await api.delete<T>(url);
    return response.data;
  } catch {
    return undefined;
  }
}
