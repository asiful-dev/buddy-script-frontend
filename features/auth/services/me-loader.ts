"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/shared/libs/redux.config";
import { authApi } from "../services/api";
import { setUser, clearUser } from "../slices/auth.slice";

export function useInitUser() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only try to fetch user if token exists
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    if (!token) {
      dispatch(clearUser());
      return;
    }

    (async () => {
      try {
        const user = await authApi.me();
        dispatch(setUser(user));
      } catch (error) {
        // Silently handle 401 errors - user is not authenticated
        // Clear token if it's invalid
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        dispatch(clearUser());
      }
    })();
  }, [dispatch]);
}
