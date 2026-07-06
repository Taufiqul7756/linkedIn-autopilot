import { get, post } from "@/lib/api";

export const authService = () => ({
  getMe: () => get("/auth/me/"),
  login: (data: { email: string; password: string }) => post("/auth/login/", data),
  logout: () => post("/auth/logout/"),
  refresh: () => post("/auth/refresh/"),
});
