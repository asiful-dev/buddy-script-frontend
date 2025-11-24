import axios from "@/shared/libs/axios.config";
import {
  LoginPayload,
  RegisterPayload,
  AuthSuccessResponse,
  User,
} from "../types/auth.definitions";
import type { ApiResponse } from "@/shared/types/axios.definitions";

export const authApi = {
  register: async (payload: RegisterPayload) => {
    const res = await axios.post<ApiResponse<AuthSuccessResponse>>(
      "/api/users/register",
      payload
    );
    return res.data.data;
  },

  login: async (payload: LoginPayload) => {
    const res = await axios.post<ApiResponse<AuthSuccessResponse>>(
      "/api/users/login",
      payload
    );
    return res.data.data;
  },

  me: async () => {
    const res = await axios.get<ApiResponse<User>>("/api/users/me");
    return res.data.data;
  },

  logout: async () => {
    const res = await axios.post<ApiResponse<void>>("/api/users/logout");
    return res.data.message;
  },
};
