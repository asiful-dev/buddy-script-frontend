import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload;
    },
  },
});

export const { setPosts } = feedSlice.actions;
export default feedSlice.reducer;
