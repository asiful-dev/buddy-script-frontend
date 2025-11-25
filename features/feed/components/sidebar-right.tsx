"use client";

import Link from "next/link";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Input } from "@/shared/components/ui/input";

const suggestedPeople = [
  {
    id: "1",
    name: "Radovan SkillArena",
    role: "Founder & CEO at Trophy",
    avatar: "/assests/people1.png",
  }
];

const friends = [
  {
    id: "1",
    name: "Radovan SkillArena",
    role: "Founder & CEO at Trophy",
    avatar: "/assests/people1.png",
    isOnline: false,
    lastSeen: "5 minute ago",
  },
  {
    id: "2",
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    avatar: "/assests/people2.png",
    isOnline: true,
  },
  {
    id: "3",
    name: "Dylan Field",
    role: "CEO of Figma",
    avatar: "/assests/people3.png",
    isOnline: true,
  },
];

export default function SidebarRight() {
  return (
    <div className="space-y-4">
      {/* Suggested People */}
      <Card className="bg-card dark:bg-[#112032] rounded-none shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold">You Might Like</h4>
            <Link href="#" className="text-sm text-blue-500 hover:underline">
              See All
            </Link>
          </div>

          <div className="space-y-4">
            {suggestedPeople.map((person) => {
              const initials = person.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();

              return (
                <div key={person.id} className="flex flex-col justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={person.avatar} alt={person.name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="">
                      <Link href={`/profile/${person.id}`}>
                        <h5 className="font-semibold text-sm hover:underline">
                          {person.name}
                        </h5>
                      </Link>
                      <p className="text-xs text-muted-foreground">{person.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 [&_button]:rounded-sm">
                    <Button 
                    variant="outline" 
                    size="lg"
                    className="border border-gray-100 text-black hover:bg-blue-500 hover:text-white dark:text-white dark:border-gray-700 dark:hover:bg-blue-500 dark:hover:text-white"
                    >
                      Ignore
                    </Button>
                    <Button 
                    size="lg"
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    >Follow
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Friends List */}
      <Card className="bg-card dark:bg-[#112032] rounded-none shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold">Your Friends</h4>
            <Link href="/find-friends" className="text-sm text-blue-500 hover:underline">
              See All
            </Link>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path strokeLinecap="round" strokeWidth="2" d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <Input
              type="search"
              placeholder="Search friends..."
              className="pl-10 bg-muted/50"
            />
          </div>

          {/* Friends List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {friends.map((friend) => {
              const initials = friend.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={friend.id}
                  className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      {friend.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div>
                      <Link href={`/profile/${friend.id}`}>
                        <h5 className="font-semibold text-sm hover:underline">
                          {friend.name}
                        </h5>
                      </Link>
                      <p className="text-xs text-muted-foreground">{friend.role}</p>
                    </div>
                  </div>
                  {!friend.isOnline && friend?.lastSeen && (
                    <span className="text-xs text-muted-foreground">
                      {friend?.lastSeen}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
