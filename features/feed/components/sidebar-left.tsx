"use client";

import Link from "next/link";
import {
  BookOpen,
  TrendingUp,
  UserPlus,
  Bookmark,
  Users,
  Settings,
  Save,
  CirclePlay,
  Gamepad,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import SuggestedPeople from "./suggested-people";
import EventsSection from "./events-section";

const exploreLinks = [
  { label: "Learning", icon: CirclePlay, badge: "New", href: "#" },
  { label: "Insights", icon: TrendingUp, href: "#" },
  { label: "Find friends", icon: UserPlus, href: "/find-friends" },
  { label: "Bookmarks", icon: Bookmark, href: "#" },
  { label: "Group", icon: Users, href: "/group" },
  { label: "Gaming", icon: Gamepad, badge: "New", href: "#" },
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Save post", icon: Save, href: "#" },
];

export default function SidebarLeft() {
  return (
    <div className="space-y-4">
      {/* Explore Section */}
      <Card className="bg-card dark:bg-[#112032] rounded-none shadow-none">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold mb-6">Explore</h4>
          <ul className="space-y-2">
            {exploreLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between gap-3 p-2 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5}/>
                      <span className="text-sm hover:text-blue-600
                      transition-colors duration-100
                      ">{link.label}</span>
                    </div>
                    {link.badge && (
                      <Badge className="text-xs bg-green-500" >
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      {/* Suggested People Section */}
      <SuggestedPeople />

      {/* Events Section */}
      <EventsSection />
    </div>
  );
}
