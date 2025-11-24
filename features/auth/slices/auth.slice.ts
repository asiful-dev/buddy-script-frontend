import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/auth.definitions";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  initialized: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.initialized = true;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.initialized = true;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
