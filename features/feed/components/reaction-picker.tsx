"use client";

import { useState, useRef, useEffect } from "react";
import { ThumbsUp, Heart, Smile, HeartHandshake, Angry } from "lucide-react";
import type { ReactionType } from "../types/feed.definitions";

interface ReactionPickerProps {
  currentReaction?: ReactionType | null;
  onSelect: (reaction: ReactionType) => void;
  onRemove?: () => void;
}

const reactions: Array<{ type: ReactionType; label: string; icon: React.ElementType; color: string; emoji?: string }> = [
  { type: "like", label: "Like", icon: ThumbsUp, color: "text-blue-500" },
  { type: "love", label: "Love", icon: Heart, color: "text-red-500" },
  { type: "haha", label: "Haha", icon: Smile, color: "text-yellow-500" },
  { type: "care", label: "Care", icon: HeartHandshake, color: "text-yellow-500" },
  { type: "angry", label: "Angry", icon: Angry, color: "text-orange-500" },
];

export default function ReactionPicker({ currentReaction, onSelect, onRemove }: ReactionPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleReactionClick = (reactionType: ReactionType) => {
    if (currentReaction === reactionType && onRemove) {
      onRemove();
    } else {
      onSelect(reactionType);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 flex items-center gap-1 bg-white dark:bg-gray-900 rounded-full px-2 py-1 shadow-lg border border-gray-300 dark:border-gray-700 z-50 animate-in fade-in zoom-in-95 duration-200">
          {reactions.map(({ type, label, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => handleReactionClick(type)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
                currentReaction === type ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
              title={label}
            >
              <Icon className={`h-6 w-6 ${color} transition-transform`} />
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => {
          if (currentReaction && onRemove) {
            handleReactionClick(currentReaction);
          } else {
            setIsOpen(!isOpen);
          }
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => {
          // Delay closing to allow moving to picker
          setTimeout(() => {
            if (!pickerRef.current?.matches(":hover")) {
              setIsOpen(false);
            }
          }, 200);
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          currentReaction
            ? "bg-blue-500/10 text-blue-500"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50"
        }`}
      >
        {currentReaction ? (
          (() => {
            const reaction = reactions.find((r) => r.type === currentReaction);
            if (!reaction) return <ThumbsUp className="h-5 w-5" />;
            const Icon = reaction.icon;
            return (
              <>
                <Icon className={`h-5 w-5 ${reaction.color} fill-current`} />
                <span className="text-sm font-medium capitalize">{reaction.label}</span>
              </>
            );
          })()
        ) : (
          <>
            <ThumbsUp className="h-5 w-5" />
            <span className="text-sm font-medium">Like</span>
          </>
        )}
      </button>
    </div>
  );
}
