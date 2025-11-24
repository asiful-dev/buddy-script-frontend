"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/shared/libs/redux.config";
import { authApi } from "../services/api";
import { setUser, clearUser } from "../slices/auth.slice";

export function useInitUser() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      try {
        const user = await authApi.me();
        dispatch(setUser(user));
      } catch {
        dispatch(clearUser());
      }
    })();
  }, [dispatch]);
}
