"use client";

import FeedHeader from "@/features/feed/components/feed-header";
import ThemeToggle from "@/features/feed/components/theme-toggle";
import { useInitUser } from "@/features/auth/services/me-loader";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  useInitUser();
  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <FeedHeader />
      <ThemeToggle />
      {children}
    </div>
  );
}

