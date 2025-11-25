"use client";

import { useState } from "react";
import Image from "next/image";
// Date formatting helper
function formatDate(date: string): string {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}
import {
  MessageCircle,
  Share2,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/shared/libs/redux.config";
import { feedApi } from "../services/api";
import { updatePost, updatePostCommentCount, removePost, updatePostReaction } from "../slices/feed.slice";
import { useToast } from "@/shared/components/ToastProvider";
import PostComments from "./post-comments";
import ReactionPicker from "./reaction-picker";
import ReactionDisplay from "./reaction-display";
import EditPostModal from "./edit-post-modal";
import type { Post, ReactionType } from "../types/feed.definitions";

interface PostItemProps {
  post: Post;
}

export default function PostItem({ post: initialPost }: PostItemProps) {
  const [showComments, setShowComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const posts = useAppSelector((state) => state.feed.posts);
  
  // Safely get post from store or use initial post, ensuring we always have valid data
  const storePost = posts.find((p) => p._id === initialPost._id);
  // Use store post only if it has valid author data, otherwise fall back to initial post
  const post: Post = (storePost && storePost.author && storePost.author.firstName) ? storePost : initialPost;
  const { error: showError } = useToast();
  const [isReacting, setIsReacting] = useState(false);

  const isAuthor = user?._id === post.author?._id;
  const authorName = post.author 
    ? `${post.author.firstName || ""} ${post.author.lastName || ""}`.trim() || post.author.email || "Unknown User"
    : "Unknown User";
  const authorInitials = post.author
    ? `${post.author.firstName?.[0] || ""}${post.author.lastName?.[0] || ""}`.toUpperCase() || post.author.email?.[0]?.toUpperCase() || "U"
    : "U";

  // Get total reactions count (prefer new structure, fallback to legacy)
  const totalReactions = post.totalReactions || post.likeCount || 0;
  const userReaction = post.userReaction || (post.userHasLiked ? 'like' : null);
  
  // Get all user IDs who reacted (from reaction breakdown)
  const getAllUserIds = (): string[] => {
    if (!post.reactions) return [];
    const allIds: string[] = [];
    Object.values(post.reactions).forEach((reaction) => {
      allIds.push(...(reaction.userIds || []));
    });
    return [...new Set(allIds)]; // Remove duplicates
  };

  const handleReaction = async (reactionType: ReactionType) => {
    if (isReacting) return;
    
    const currentReaction = userReaction;
    setIsReacting(true);
    
    // Store original values for rollback
    const originalReaction = post.userReaction;
    const originalTotalReactions = post.totalReactions;
    const originalReactions = post.reactions;
    
    // Optimistic update - update reaction state immediately
    const newReaction = currentReaction === reactionType ? null : reactionType;
    dispatch(updatePostReaction({
      postId: post._id,
      userReaction: newReaction,
      totalReactions: currentReaction === reactionType 
        ? Math.max(0, (post.totalReactions || 0) - 1)
        : (post.totalReactions || 0) + 1,
    }));
    
    try {
      // If clicking same reaction type, remove it
      if (currentReaction === reactionType) {
        await feedApi.removeReaction({ targetType: "post", targetId: post._id });
      } else {
        // Add or change reaction
        await feedApi.react({
          targetType: "post",
          targetId: post._id,
          reactionType,
        });
      }

      // Get updated reactions from server to sync with actual state
      try {
        const reactionData = await feedApi.getReactions("post", post._id);
        dispatch(updatePostReaction({
          postId: post._id,
          reactions: reactionData.reactions,
          totalReactions: reactionData.totalReactions,
          userReaction: reactionData.userReaction,
        }));
      } catch (refreshError) {
        // If refresh fails, revert optimistic update
        dispatch(updatePostReaction({
          postId: post._id,
          reactions: originalReactions,
          totalReactions: originalTotalReactions,
          userReaction: originalReaction,
        }));
        showError("Failed to update reaction. Please try again.");
      }
    } catch (err: any) {
      // Revert optimistic update on error
      dispatch(updatePostReaction({
        postId: post._id,
        reactions: originalReactions,
        totalReactions: originalTotalReactions,
        userReaction: originalReaction,
      }));
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to react to post";
      showError(errorMessage);
    } finally {
      setIsReacting(false);
    }
  };

  const handleRemoveReaction = async () => {
    if (isReacting || !userReaction) return;
    
    setIsReacting(true);
    
    // Store original values for rollback
    const originalReaction = post.userReaction;
    const originalTotalReactions = post.totalReactions;
    const originalReactions = post.reactions;
    
    // Optimistic update
    dispatch(updatePostReaction({
      postId: post._id,
      userReaction: null,
      totalReactions: Math.max(0, (post.totalReactions || 0) - 1),
    }));
    
    try {
      await feedApi.removeReaction({ targetType: "post", targetId: post._id });
      
      // Get updated reactions from server to sync with actual state
      try {
        const reactionData = await feedApi.getReactions("post", post._id);
        dispatch(updatePostReaction({
          postId: post._id,
          reactions: reactionData.reactions,
          totalReactions: reactionData.totalReactions,
          userReaction: reactionData.userReaction,
        }));
      } catch (refreshError) {
        // If refresh fails, revert optimistic update
        dispatch(updatePostReaction({
          postId: post._id,
          reactions: originalReactions,
          totalReactions: originalTotalReactions,
          userReaction: originalReaction,
        }));
        showError("Failed to update reaction. Please try again.");
      }
    } catch (err: any) {
      // Revert optimistic update on error
      dispatch(updatePostReaction({
        postId: post._id,
        reactions: originalReactions,
        totalReactions: originalTotalReactions,
        userReaction: originalReaction,
      }));
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to remove reaction";
      showError(errorMessage);
    } finally {
      setIsReacting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await feedApi.deletePost(post._id);
      dispatch(removePost(post._id));
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to delete post";
      showError(errorMessage);
    }
  };

  return (
    <Card className="bg-card dark:bg-[#112032]">
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author?.avatar?.url || "/assests/profile.png"} alt={authorName} />
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-sm">{authorName}</h4>
              <p className="text-xs text-muted-foreground">
                {post.createdAt ? formatDate(post.createdAt) : "Just now"} ·{" "}
                <span className="capitalize">{post.visibility || "public"}</span>
              </p>
            </div>
          </div>

          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                  Edit Post
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Post Content */}
        {post.content && (
          <p className="text-sm mb-4 whitespace-pre-wrap">{post.content}</p>
        )}

        {/* Post Image */}
        {post.image?.url && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <Image
              src={post.image.url}
              alt="Post image"
              width={800}
              height={600}
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}

        {/* Post Stats */}
        {(totalReactions > 0 || post.commentCount > 0) && (
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-300 dark:border-gray-700">
            {totalReactions > 0 && (
              <ReactionDisplay
                reactions={post.reactions}
                totalReactions={totalReactions}
                userIds={getAllUserIds()}
                maxAvatars={5}
              />
            )}
            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
              <span>{post.commentCount || 0} {post.commentCount === 1 ? "Comment" : "Comments"}</span>
              <span>0 Share</span>
            </div>
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex-1 flex items-center justify-center">
            <ReactionPicker
              currentReaction={userReaction || undefined}
              onSelect={handleReaction}
              onRemove={userReaction ? handleRemoveReaction : undefined}
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Comment
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
            <PostComments postId={post._id} />
          </div>
        )}
      </CardContent>

      {/* Edit Post Modal */}
      <EditPostModal
        post={post}
        open={showEditModal}
        onOpenChange={setShowEditModal}
      />
    </Card>
  );
}
