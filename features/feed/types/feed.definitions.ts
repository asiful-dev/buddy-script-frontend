export interface Post {
  _id: string;
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  image?: {
    url: string;
    publicId: string;
  };
  visibility: 'public' | 'private';
  likeCount: number;
  userHasLiked: boolean;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  post: string;
  parentComment?: string | null;
  likeCount: number;
  userHasLiked: boolean;
  replyCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FeedResponse {
  posts: Post[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface CommentsResponse {
  comments: Comment[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface CreatePostPayload {
  content: string;
  visibility?: 'public' | 'private';
  image?: File;
}

export interface CreateCommentPayload {
  content: string;
}

export interface LikePayload {
  targetType: 'post' | 'comment';
  targetId: string;
}

