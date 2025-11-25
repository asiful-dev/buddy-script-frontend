"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/libs/redux.config";
import { feedApi } from "../services/api";
import { setFeed, setLoading, setError, resetFeed } from "../slices/feed.slice";
import PostItem from "./post-item";
import { Button } from "@/shared/components/ui/button";
import type { FeedResponse } from "../types/feed.definitions";

export default function PostList() {
  const dispatch = useAppDispatch();
  const { posts, isLoading, hasMore, nextCursor } = useAppSelector((state) => state.feed);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFeed();

    return () => {
      dispatch(resetFeed());
    };
  }, []);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, nextCursor]);

  const loadFeed = async () => {
    try {
      dispatch(setLoading(true));
      const response = await feedApi.getFeed(undefined, 10);
      console.log("Feed response:", response);
      // Ensure response has the correct structure
      const feedData: FeedResponse = {
        posts: response.posts || [],
        nextCursor: response.nextCursor,
        hasMore: response.hasMore ?? true,
      };
      dispatch(setFeed(feedData));
    } catch (err: any) {
      console.error("Error loading feed:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to load feed";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loadMore = async () => {
    if (!nextCursor || isLoading) return;

    try {
      dispatch(setLoading(true));
      const response = await feedApi.getFeed(nextCursor, 10);
      dispatch(setFeed(response));
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to load more posts";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (isLoading && posts?.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading posts...</div>
      </div>
    );
  }

  if (posts?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-4">No posts yet</p>
        <p className="text-sm text-muted-foreground">Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}

      {/* Loading indicator for pagination */}
      {isLoading && posts?.length > 0 && (
        <div className="flex items-center justify-center py-4">
          <div className="text-sm text-muted-foreground">Loading more posts...</div>
        </div>
      )}

      {/* Observer target for infinite scroll */}
      <div ref={observerTarget} className="h-4" />

      {/* Load more button fallback */}
      {hasMore && !isLoading && (
        <div className="flex justify-center py-4">
          <Button variant="outline" onClick={loadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
