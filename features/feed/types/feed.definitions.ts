export type ReactionType = 'like' | 'love' | 'haha' | 'care' | 'angry';

export interface ReactionBreakdown {
  like: { count: number; userIds: string[] };
  love: { count: number; userIds: string[] };
  haha: { count: number; userIds: string[] };
  care: { count: number; userIds: string[] };
  angry: { count: number; userIds: string[] };
}

export interface Post {
  _id: string;
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: {
      url: string;
      publicId: string;
    };
  };
  image?: {
    url: string;
    publicId: string;
  };
  visibility: 'public' | 'private';
  reactions?: ReactionBreakdown;
  totalReactions?: number;
  userReaction?: ReactionType | null;
  likeCount?: number; // Legacy support
  userHasLiked?: boolean; // Legacy support
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
    avatar?: {
      url: string;
      publicId: string;
    };
  };
  post: string;
  parentComment?: string | null;
  reactions?: ReactionBreakdown;
  totalReactions?: number;
  userReaction?: ReactionType | null;
  likeCount?: number; // Legacy support
  userHasLiked?: boolean; // Legacy support
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

export interface ReactionPayload {
  targetType: 'post' | 'comment';
  targetId: string;
  reactionType: ReactionType;
}

export interface RemoveReactionPayload {
  targetType: 'post' | 'comment';
  targetId: string;
}

export interface ReactionResponse {
  totalReactions: number;
  userReaction: ReactionType | null;
  reactions: ReactionBreakdown;
}

export interface LikePayload {
  targetType: 'post' | 'comment';
  targetId: string;
}

