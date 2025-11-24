import axios from "@/shared/libs/axios.config";

export const authApi = {
  login: (payload: unknown) => axios.post("/auth/login", payload),
  register: (payload: unknown) => axios.post("/auth/register", payload),
};
