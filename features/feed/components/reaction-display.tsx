"use client";

import { ThumbsUp, Heart, Smile, HeartHandshake, Angry } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import type { ReactionBreakdown, ReactionType } from "../types/feed.definitions";

interface ReactionDisplayProps {
  reactions?: ReactionBreakdown;
  totalReactions?: number;
  userIds?: string[]; // Array of user IDs who reacted (for profile pictures)
  maxAvatars?: number;
}

const reactionIcons: Record<ReactionType, { icon: React.ElementType; color: string }> = {
  like: { icon: ThumbsUp, color: "text-blue-500" },
  love: { icon: Heart, color: "text-red-500" },
  haha: { icon: Smile, color: "text-yellow-500" },
  care: { icon: HeartHandshake, color: "text-yellow-500" },
  angry: { icon: Angry, color: "text-orange-500" },
};

export default function ReactionDisplay({
  reactions,
  totalReactions = 0,
  userIds = [],
  maxAvatars = 5,
}: ReactionDisplayProps) {
  if (!reactions || totalReactions === 0) return null;

  // Get all reaction types that have counts
  const activeReactions = Object.entries(reactions)
    .filter(([_, data]) => data.count > 0)
    .sort(([_, a], [__, b]) => b.count - a.count);

  if (activeReactions.length === 0) return null;

  // Get first few user IDs for avatars
  const displayUserIds = userIds.slice(0, maxAvatars);
  const remainingCount = userIds.length - maxAvatars;

  return (
    <div className="flex items-center gap-2">
      {/* User Avatars */}
      {displayUserIds.length > 0 && (
        <div className="flex items-center -space-x-2">
          {displayUserIds.map((userId, idx) => (
            <Avatar key={userId} className="w-5 h-5 border-2 border-[#112032] dark:border-[#1A1F2E]">
              <AvatarImage src={`/assests/profile.png`} alt="User" />
              <AvatarFallback className="text-[8px] bg-gradient-to-br from-blue-400 to-blue-600" />
            </Avatar>
          ))}
          {remainingCount > 0 && (
            <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-[#112032] dark:border-[#1A1F2E] flex items-center justify-center">
              <span className="text-[8px] font-semibold text-white">+{remainingCount}</span>
            </div>
          )}
        </div>
      )}

      {/* Reaction Icons */}
      <div className="flex items-center gap-1">
        {activeReactions.slice(0, 3).map(([reactionType, data]) => {
          const { icon: Icon, color } = reactionIcons[reactionType as ReactionType];
          return (
            <Icon
              key={reactionType}
              className={`h-4 w-4 ${color} fill-current`}
              title={`${data.count} ${reactionType}`}
            />
          );
        })}
        {activeReactions.length > 3 && (
          <span className="text-xs text-gray-600 dark:text-gray-400">+{activeReactions.length - 3}</span>
        )}
      </div>
    </div>
  );
}
