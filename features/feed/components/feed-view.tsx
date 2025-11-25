"use client";

import FeedHeader from "./feed-header";
import SidebarLeft from "./sidebar-left";
import SidebarRight from "./sidebar-right";
import StoriesSection from "./stories-section";
import CreatePostBox from "./create-post-box";
import PostList from "./post-list";
import ThemeToggle from "./theme-toggle";

export default function FeedView() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#232E42]">
      {/* Header */}
      <FeedHeader />
      
      {/* Theme Toggle - Fixed Position */}
      <ThemeToggle />

      {/* Main Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto hide-scrollbar">
              <SidebarLeft />
            </div>
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-6 space-y-4">
            <StoriesSection />
            <CreatePostBox />
            <PostList />
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto hide-scrollbar">
              <SidebarRight />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
