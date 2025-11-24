import axios from "@/shared/libs/axios.config";

export const feedApi = {
  getAll: () => axios.get("/posts"),
};
