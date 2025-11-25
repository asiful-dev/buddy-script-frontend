import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Post, FeedResponse } from "../types/feed.definitions";

interface FeedState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  nextCursor: string | null;
  hasMore: boolean;
}

const initialState: FeedState = {
  posts: [],
  isLoading: false,
  error: null,
  nextCursor: null,
  hasMore: true,
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setFeed(state, action: PayloadAction<FeedResponse>) {
      // Ensure posts array exists
      if (!state.posts) {
        state.posts = [];
      }
      
      if (action.payload.nextCursor && state.posts.length > 0) {
        // Append posts for pagination
        state.posts = [...state.posts, ...(action.payload.posts || [])];
      } else {
        // Initial load - replace posts
        state.posts = action.payload.posts || [];
      }
      state.nextCursor = action.payload.nextCursor || null;
      state.hasMore = action.payload.hasMore ?? true;
      state.isLoading = false;
      state.error = null;
    },
    addPost(state, action: PayloadAction<Post>) {
      if (!state.posts) {
        state.posts = [];
      }
      state.posts.unshift(action.payload);
    },
    updatePost(state, action: PayloadAction<Post>) {
      const index = state.posts.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        // Merge updated data with existing post to preserve all fields
        const existingPost = state.posts[index];
        state.posts[index] = {
          ...existingPost,
          ...action.payload,
          // Always preserve author from existing post if new one is missing/incomplete
          author: action.payload.author && action.payload.author.firstName 
            ? action.payload.author 
            : existingPost.author,
          // Preserve image if not in payload
          image: action.payload.image ?? existingPost.image,
          // Preserve content if not in payload
          content: action.payload.content ?? existingPost.content,
          // Preserve visibility if not in payload
          visibility: action.payload.visibility || existingPost.visibility,
          // Preserve timestamps if missing
          createdAt: action.payload.createdAt || existingPost.createdAt,
          updatedAt: action.payload.updatedAt || existingPost.updatedAt,
        };
      }
    },
    updatePostReaction(state, action: PayloadAction<{ postId: string; reactions?: import("../types/feed.definitions").ReactionBreakdown; totalReactions?: number; userReaction?: import("../types/feed.definitions").ReactionType | null }>) {
      const post = state.posts.find((p) => p._id === action.payload.postId);
      if (post) {
        if (action.payload.reactions !== undefined) {
          post.reactions = action.payload.reactions;
        }
        if (action.payload.totalReactions !== undefined) {
          post.totalReactions = action.payload.totalReactions;
        }
        if (action.payload.userReaction !== undefined) {
          post.userReaction = action.payload.userReaction;
        }
      }
    },
    removePost(state, action: PayloadAction<string>) {
      state.posts = state.posts.filter((p) => p._id !== action.payload);
    },
    updatePostLike(state, action: PayloadAction<{ postId: string; liked: boolean; userId?: string }>) {
      const post = state.posts.find((p) => p._id === action.payload.postId);
      if (post) {
        const wasLiked = post.userHasLiked;
        const newLiked = action.payload.liked;
        
        // Update like state
        post.userHasLiked = newLiked;
        
        // Update like count - only change if state actually changed
        if (wasLiked !== newLiked) {
          if (newLiked) {
            post.likeCount = (post.likeCount || 0) + 1;
          } else {
            post.likeCount = Math.max(0, (post.likeCount || 0) - 1);
          }
        }
      }
    },
    updatePostCommentCount(state, action: PayloadAction<{ postId: string; increment: number }>) {
      const post = state.posts.find((p) => p._id === action.payload.postId);
      if (post) {
        post.commentCount += action.payload.increment;
      }
    },
    resetFeed(state) {
      state.posts = [];
      state.nextCursor = null;
      state.hasMore = true;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setFeed,
  addPost,
  updatePost,
  removePost,
  updatePostLike,
  updatePostReaction,
  updatePostCommentCount,
  resetFeed,
} = feedSlice.actions;

export default feedSlice.reducer;
