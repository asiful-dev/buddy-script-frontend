import axios from "@/shared/libs/axios.config";
import {
  LoginPayload,
  RegisterPayload,
  AuthSuccessResponse,
  User,
  UpdateUserPayload,
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

  updateUser: async (payload: UpdateUserPayload, user: User) => {
    const formData = new FormData();
    formData.append("firstName", payload.firstName || user?.firstName || "");
    formData.append("lastName", payload.lastName || user?.lastName || "");
    formData.append("email", payload.email || user?.email || "");
    if (payload.password) {
      formData.append("password", payload.password);
    }
    if (payload.avatar) {
      formData.append("avatar", payload.avatar);
    }

    // Don't set Content-Type - axios interceptor handles FormData automatically
    const res = await axios.patch<ApiResponse<User>>("/api/users/update", formData, {
      timeout: 90000, // 90 seconds for file uploads
    });
    return res.data.data;
  },

  logout: async () => {
    const res = await axios.post<ApiResponse<void>>("/api/users/logout");
    return res.data.message;
  },
};
