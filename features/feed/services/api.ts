import axios from "@/shared/libs/axios.config";
import type {
  FeedResponse,
  CommentsResponse,
  Post,
  Comment,
  CreatePostPayload,
  CreateCommentPayload,
  ReactionPayload,
  RemoveReactionPayload,
  ReactionResponse,
  LikePayload,
} from "../types/feed.definitions";
import type { ApiResponse } from "@/shared/types/axios.definitions";

export const feedApi = {
  getFeed: async (cursor?: string, limit: number = 10): Promise<FeedResponse> => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", limit.toString());
    
    const response = await axios.get<ApiResponse<FeedResponse>>(`/api/posts/feed?${params.toString()}`);
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<FeedResponse>).data;
    }
    return response.data as FeedResponse;
  },

  createPost: async (payload: CreatePostPayload): Promise<Post> => {
    const formData = new FormData();
    
    formData.append("content", payload.content);
    if (payload.visibility) {
      formData.append("visibility", payload.visibility);
    }
    
    if (payload.image) {
      formData.append("image", payload.image, payload.image.name);
    }

    const response = await axios.post<ApiResponse<Post>>("/api/posts", formData, {
      timeout: 90000,
    });
    
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<Post>).data;
    }
    return response.data as Post;
  },

  getPostById: async (postId: string): Promise<Post> => {
    const response = await axios.get<ApiResponse<Post>>(`/api/posts/${postId}`);
    
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<Post>).data;
    }
    
    return response.data as Post;
  },

  updatePost: async (postId: string, payload: Partial<CreatePostPayload>): Promise<Post> => {
    const formData = new FormData();
    if (payload.content) formData.append("content", payload.content);
    if (payload.visibility) formData.append("visibility", payload.visibility);
    if (payload.image) formData.append("image", payload.image);

    const response = await axios.patch<ApiResponse<Post>>(`/api/posts/${postId}`, formData, {
      timeout: 90000,
    });
    
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<Post>).data;
    }
    return response.data as Post;
  },

  deletePost: async (postId: string): Promise<void> => {
    await axios.delete(`/api/posts/${postId}`);
  },

  react: async (payload: ReactionPayload): Promise<void> => {
    await axios.post("/api/likes", payload);
  },

  removeReaction: async (payload: RemoveReactionPayload): Promise<void> => {
    await axios.delete("/api/likes", { data: payload });
  },

  getReactions: async (targetType: 'post' | 'comment', targetId: string): Promise<ReactionResponse> => {
    const response = await axios.get<ApiResponse<ReactionResponse>>(`/api/likes/${targetType}/${targetId}`);
    
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<ReactionResponse>).data;
    }
    
    return response.data as ReactionResponse;
  },

  // Legacy support - map to new API
  like: async (payload: LikePayload): Promise<void> => {
    await axios.post("/api/likes", {
      ...payload,
      reactionType: 'like' as const,
    });
  },

  unlike: async (payload: LikePayload): Promise<void> => {
    await axios.delete("/api/likes", { data: payload });
  },

  getComments: async (
    postId: string,
    cursor?: string,
    limit: number = 10
  ): Promise<CommentsResponse> => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", limit.toString());

    const response = await axios.get<ApiResponse<CommentsResponse>>(
      `/api/comments/post/${postId}?${params.toString()}`
    );
    
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<CommentsResponse>).data;
    }
    
    if (response.data && 'comments' in response.data) {
      return response.data as CommentsResponse;
    }
    
    return { comments: [], hasMore: false };
  },

  createComment: async (postId: string, payload: CreateCommentPayload): Promise<Comment> => {
    const response = await axios.post<ApiResponse<Comment>>(`/api/comments/post/${postId}`, payload);
    
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<Comment>).data;
    }
    
    return response.data as Comment;
  },

  createReply: async (commentId: string, payload: CreateCommentPayload): Promise<Comment> => {
    const response = await axios.post<ApiResponse<Comment>>(`/api/comments/reply/${commentId}`, payload);
    
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<Comment>).data;
    }
    
    return response.data as Comment;
  },

  getReplies: async (commentId: string): Promise<Comment[]> => {
    const response = await axios.get<ApiResponse<Comment[]>>(`/api/comments/reply/${commentId}`);
    
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<Comment[]>).data;
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  },
};
