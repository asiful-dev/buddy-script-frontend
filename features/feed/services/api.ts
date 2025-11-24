import axios from "@/shared/libs/axios.config";
import type {
  FeedResponse,
  CommentsResponse,
  Post,
  Comment,
  CreatePostPayload,
  CreateCommentPayload,
  LikePayload,
} from "../types/feed.definitions";

export const feedApi = {
  /**
   * Get paginated feed of posts
   * @param cursor - ISO date string for pagination
   * @param limit - Number of posts to fetch (max 50, default 20)
   */
  getFeed: async (cursor?: string, limit: number = 20): Promise<FeedResponse> => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", limit.toString());
    
    const response = await axios.get<FeedResponse>(`/posts/feed?${params.toString()}`);
    return response.data;
  },

  /**
   * Create a new post
   */
  createPost: async (payload: CreatePostPayload): Promise<Post> => {
    const formData = new FormData();
    formData.append("content", payload.content);
    if (payload.visibility) {
      formData.append("visibility", payload.visibility);
    }
    if (payload.image) {
      formData.append("image", payload.image);
    }

    const response = await axios.post<Post>("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Get a single post by ID
   */
  getPostById: async (postId: string): Promise<Post> => {
    const response = await axios.get<Post>(`/posts/${postId}`);
    return response.data;
  },

  /**
   * Update a post
   */
  updatePost: async (postId: string, payload: Partial<CreatePostPayload>): Promise<Post> => {
    const formData = new FormData();
    if (payload.content) formData.append("content", payload.content);
    if (payload.visibility) formData.append("visibility", payload.visibility);
    if (payload.image) formData.append("image", payload.image);

    const response = await axios.patch<Post>(`/posts/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Delete a post
   */
  deletePost: async (postId: string): Promise<void> => {
    await axios.delete(`/posts/${postId}`);
  },

  /**
   * Like a post or comment
   */
  like: async (payload: LikePayload): Promise<void> => {
    await axios.post("/likes", payload);
  },

  /**
   * Unlike a post or comment
   */
  unlike: async (payload: LikePayload): Promise<void> => {
    await axios.delete("/likes", { data: payload });
  },

  /**
   * Get comments for a post
   */
  getComments: async (
    postId: string,
    cursor?: string,
    limit: number = 10
  ): Promise<CommentsResponse> => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", limit.toString());

    const response = await axios.get<CommentsResponse>(
      `/comments/post/${postId}?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Create a comment on a post
   */
  createComment: async (postId: string, payload: CreateCommentPayload): Promise<Comment> => {
    const response = await axios.post<Comment>(`/comments/post/${postId}`, payload);
    return response.data;
  },

  /**
   * Create a reply to a comment
   */
  createReply: async (commentId: string, payload: CreateCommentPayload): Promise<Comment> => {
    const response = await axios.post<Comment>(`/comments/reply/${commentId}`, payload);
    return response.data;
  },

  /**
   * Get replies for a comment
   */
  getReplies: async (commentId: string): Promise<Comment[]> => {
    const response = await axios.get<Comment[]>(`/comments/reply/${commentId}`);
    return response.data;
  },
};
