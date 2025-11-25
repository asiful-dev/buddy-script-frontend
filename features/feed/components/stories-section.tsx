"use client";

import { ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Card, CardContent } from "@/shared/components/ui/card";

interface Story {
  id: string;
  authorName: string;
  authorAvatar?: string;
  storyImage: string;
}

export default function StoriesSection() {
  // Mock stories data - replace with API data later
  const stories: Story[] = [
    {
      id: "1",
      authorName: "Ryan Roslansky",
      authorAvatar: "/assests/people1.png",
      storyImage: "/assests/story1.png",
    },
    {
      id: "2",
      authorName: "Ryan Roslansky",
      authorAvatar: "/assests/people2.png",
      storyImage: "/assests/story2.png",
    },
    {
      id: "3",
      authorName: "Ryan Roslansky",
      authorAvatar: "/assests/people3.png",
      storyImage: "/assests/story3.png",
    },
    {
      id: "3",
      authorName: "Ryan Roslansky",
      authorAvatar: "/assests/people2.png",
      storyImage: "/assests/story2.png",
    },
    {
      id: "4",
      authorName: "Ryan Roslansky",
      authorAvatar: "/assests/people3.png",
      storyImage: "/assests/story3.png",
    },
  ];

  return (
    <Card className="bg-white dark:bg-[#112032] rounded-none shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
          {/* Your Story Card */}
          <div className="flex-shrink-0 w-24 cursor-pointer group">
            <div className="relative rounded-lg overflow-hidden">
              <div className="relative h-32 rounded-t-lg overflow-hidden border-2 border-blue-500 border-b-0">
                <Image
                  src="/assests/story-your.png"
                  alt="Your Story"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {/* Blue Plus Button */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/5 z-10">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-[#112032]">
                    <Plus className="h-5 w-5 text-white" strokeWidth={3} />
                  </div>
                </div>
              </div>
              {/* Your Story Label - Blue Rectangle */}
              <div className="bg-[#1877F2] rounded-b-lg py-2 px-2 border-2 border-blue-500 border-t-0">
                <p className="text-xs font-semibold text-white text-center">Your Story</p>
              </div>
            </div>
          </div>

          {/* Story Cards */}
          {stories.map((story, index) => (
            <div key={story.id} className="flex-shrink-0 w-24 cursor-pointer group relative">
              <div className="relative h-40 rounded-lg overflow-hidden mb-2 border-2 border-blue-500">
                <Image
                  src={story.storyImage || "/assests/story-default.png"}
                  alt={story.authorName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {/* Profile Picture Overlay */}
                {story.authorAvatar && (
                  <div className="absolute top-2 right-2">
                    <Avatar className="h-8 w-8 border-2 border-white dark:border-[#112032]">
                      <AvatarImage src={story.authorAvatar} alt={story.authorName} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-400 to-blue-600">
                        {story.authorName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
              {/* Author Name */}
              <p className="text-xs font-medium text-gray-900 dark:text-white text-center truncate">
                {story.authorName}
              </p>
            </div>
          ))}

          {/* Scroll Arrow */}
          <div className="flex-shrink-0 flex items-center">
            <button
              className="w-8 h-8 rounded-full bg-white dark:bg-[#112032] border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm"
              aria-label="Scroll to see more stories"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

