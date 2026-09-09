import axiosClient from "../api/axios";
import type { User } from "../types/user";

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: User;
  message?: string;
}

export const signUp = (data: SignUpData): Promise<AuthResult> =>
  axiosClient.post("/api/users/register", data).then((response) => response.data);

export const login = (data: LoginData): Promise<AuthResult> =>
  axiosClient.post("/api/users/login", data).then((response) => response.data);