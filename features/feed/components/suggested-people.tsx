"use client";

import Link from "next/link";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

// Mock data - replace with API data later
const suggestedPeople = [
  {
    id: "1",
    name: "Steve Jobs",
    title: "CEO of Apple",
    avatar: "/assests/people1.png",
  },
  {
    id: "2",
    name: "Ryan Roslansky",
    title: "CEO of Linkedin",
    avatar: "/assests/people2.png",
  },
  {
    id: "3",
    name: "Dylan Field",
    title: "CEO of Figma",
    avatar: "/assests/people3.png",
  },
];

export default function SuggestedPeople() {
  return (
    <Card className="bg-white dark:bg-[#112032] rounded-lg shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">Suggested People</h4>
          <Link href="#" className="text-sm text-blue-500 hover:underline font-medium">
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
              <div key={person.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={person.avatar} alt={person.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {person.name}
                    </h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {person.title}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 border-gray-300 dark:border-gray-700 bg-white dark:bg-[#112032] hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                >
                  Connect
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

