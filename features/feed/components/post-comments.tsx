"use client";

import { useState, useEffect } from "react";
import { Send, ThumbsUp, Heart, ImageIcon, Mic } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/shared/libs/redux.config";
import { feedApi } from "../services/api";
import { updatePostCommentCount } from "../slices/feed.slice";
import { useToast } from "@/shared/components/ToastProvider";
import type { Comment } from "../types/feed.definitions";

interface PostCommentsProps {
  postId: string;
}

function formatDate(date: string): string {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export default function PostComments({ postId }: PostCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  const [replies, setReplies] = useState<Record<string, Comment[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const { error: showError, success } = useToast();

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const response = await feedApi.getComments(postId, undefined, 10);
      const commentsList = response?.comments || [];
      setComments(Array.isArray(commentsList) ? commentsList : []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to load comments";
      showError(errorMessage);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    const commentText = newComment.trim();
    setNewComment("");
    
    try {
      setIsSubmitting(true);
      const comment = await feedApi.createComment(postId, { content: commentText });
      
      if (comment && comment._id) {
        setComments((prev) => [comment, ...prev]);
        dispatch(updatePostCommentCount({ postId, increment: 1 }));
      } else {
        showError("Failed to create comment. Please try again.");
      }
    } catch (err: any) {
      setNewComment(commentText);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to add comment";
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (comment: Comment) => {
    try {
      const wasLiked = comment.userHasLiked;
      
      // Optimistic update
      setComments((prev) =>
        prev.map((c) =>
          c._id === comment._id
              ? {
                  ...c,
                  userHasLiked: !wasLiked,
                  likeCount: (c.likeCount || 0) + (wasLiked ? -1 : 1),
                }
            : c
        )
      );

      if (wasLiked) {
        await feedApi.unlike({ targetType: "comment", targetId: comment._id });
      } else {
        await feedApi.like({ targetType: "comment", targetId: comment._id });
      }
    } catch (err: any) {
      // Revert
      loadComments();
      const errorMessage = err?.response?.data?.message || "Failed to like comment";
      showError(errorMessage);
    }
  };

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    if (!replyText[commentId]) {
      setReplyText({ ...replyText, [commentId]: "" });
    }
  };

  const handleReplySubmit = async (commentId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = replyText[commentId]?.trim();
    if (!text) return;

    try {
      setIsSubmitting(true);
      const reply = await feedApi.createReply(commentId, { content: text });
      
      // Add reply to the replies state
      setReplies((prev) => ({
        ...prev,
        [commentId]: [...(prev[commentId] || []), reply],
      }));

      // Update comment reply count
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? { ...c, replyCount: (c.replyCount || 0) + 1 }
            : c
        )
      );

      dispatch(updatePostCommentCount({ postId, increment: 1 }));
      setReplyText({ ...replyText, [commentId]: "" });
      setReplyingTo(null);
      success("Reply posted!");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to post reply";
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadReplies = async (commentId: string) => {
    if (replies[commentId]) {
      setShowReplies({ ...showReplies, [commentId]: !showReplies[commentId] });
      return;
    }

    try {
      const repliesList = await feedApi.getReplies(commentId);
      setReplies({ ...replies, [commentId]: repliesList });
      setShowReplies({ ...showReplies, [commentId]: true });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to load replies";
      showError(errorMessage);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading comments...</div>;
  }

  const userInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "";

  return (
    <div className="space-y-4">
      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.map((comment) => {
            const authorName = `${comment.author?.firstName} ${comment.author?.lastName}`;
            const authorInitials = `${comment.author?.firstName?.[0] || ""}${comment.author?.lastName?.[0] || ""}`.toUpperCase();
            const commentReplies = replies[comment._id] || [];
            const isReplying = replyingTo === comment._id;

            return (
              <div key={comment._id} className="space-y-3">
                <div className="flex gap-3">
                  <Avatar className="h-9 w-9 border-2 border-blue-500">
                    <AvatarImage src={comment.author?.avatar?.url || "/assests/profile.png"} alt={authorName} />
                    <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-[#2A2E35] rounded-lg p-3">
                      <h5 className="font-semibold text-sm mb-1 text-gray-900 dark:text-white">{authorName}</h5>
                      <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{comment.content}</p>
                    {(comment.totalReactions || comment.likeCount || 0) > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <ThumbsUp className="h-3 w-3 text-blue-500 fill-blue-500" />
                        <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{comment.totalReactions || comment.likeCount || 0}</span>
                      </div>
                    )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 px-1">
                      <button
                        onClick={() => handleLike(comment)}
                        className={`text-xs ${comment.userHasLiked ? "text-blue-500 font-semibold" : "text-gray-600 dark:text-gray-400"} hover:text-blue-500 transition-colors`}
                      >
                        Like.
                      </button>
                      <button
                        onClick={() => handleReplyClick(comment._id)}
                        className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        Reply.
                      </button>
                      <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                        Share
                      </button>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {((comment.replyCount || 0) > 0 || commentReplies.length > 0) && (
                  <div className="ml-11">
                    <button
                      onClick={() => loadReplies(comment._id)}
                      className="text-xs text-blue-500 hover:underline mb-2"
                    >
                      View {(comment.replyCount || 0) || commentReplies.length} {((comment.replyCount || 0) === 1) ? "reply" : "replies"}
                    </button>
                    {showReplies[comment._id] && commentReplies.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {commentReplies.map((reply) => {
                          const replyAuthorName = `${reply.author?.firstName} ${reply.author?.lastName}`;
                          const replyAuthorInitials = `${reply.author?.firstName?.[0] || ""}${reply.author?.lastName?.[0] || ""}`.toUpperCase();
                          return (
                            <div key={reply._id} className="flex gap-2">
                              <Avatar className="h-7 w-7 border border-blue-500">
                                <AvatarImage src={reply.author?.avatar?.url || "/assests/profile.png"} alt={replyAuthorName} />
                                <AvatarFallback className="text-xs">{replyAuthorInitials}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-gray-100 dark:bg-[#2A2E35] rounded-lg p-2">
                                  <h5 className="font-semibold text-xs mb-1 text-gray-900 dark:text-white">{replyAuthorName}</h5>
                                  <p className="text-xs text-gray-800 dark:text-gray-200">{reply.content}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Reply Input */}
                {isReplying && (
                  <div className="ml-11">
                    <form onSubmit={(e) => handleReplySubmit(comment._id, e)} className="flex gap-2 items-start">
                      <Avatar className="h-8 w-8 border border-blue-500">
                        <AvatarImage src={user?.avatar?.url || "/assests/profile.png"} alt={user?.firstName} />
                        <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 relative">
                        <Textarea
                          value={replyText[comment._id] || ""}
                          onChange={(e) => setReplyText({ ...replyText, [comment._id]: e.target.value })}
                          placeholder="Write a reply..."
                          className="min-h-[40px] resize-none bg-gray-100 dark:bg-[#2A2E35] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border-none pr-16"
                          rows={1}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6" type="button">
                            <Mic className="h-3 w-3 text-gray-400" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" type="button">
                            <ImageIcon className="h-3 w-3 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={!replyText[comment._id]?.trim() || isSubmitting}
                        size="icon"
                        className="h-8 w-8 bg-blue-500 hover:bg-blue-600"
                      >
                        <Send className="h-3 w-3" />
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-start">
        <Avatar className="h-9 w-9 border-2 border-blue-500">
          <AvatarImage src={user?.avatar?.url || "/assests/profile.png"} alt={user?.firstName} />
          <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 relative">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="min-h-[50px] resize-none bg-gray-100 dark:bg-[#2A2E35] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border-none pr-16"
            rows={2}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" type="button">
              <Mic className="h-4 w-4 text-gray-400" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" type="button">
              <ImageIcon className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          disabled={!newComment.trim() || isSubmitting}
          size="icon"
          className="h-9 w-9 bg-blue-500 hover:bg-blue-600"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

