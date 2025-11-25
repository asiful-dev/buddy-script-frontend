"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Home, Users, Bell, MessageCircle, Settings, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/shared/libs/redux.config";
import { clearUser } from "@/features/auth/slices/auth.slice";
import { authApi } from "@/features/auth/services/api";
import { setAuthToken } from "@/shared/libs/axios.config";
import { useToast } from "@/shared/components/ToastProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

export default function FeedHeader() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const initialized = useAppSelector((state) => state.auth.initialized);
  const { success } = useToast();
  
  const userInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "";

  const displayName = user && (user.firstName || user.lastName)
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email?.split("@")[0] || "User"
    : user?.email
    ? user.email.split("@")[0]
    : initialized
    ? "User"
    : "Loading...";

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setAuthToken(null);
      dispatch(clearUser());
      success("Logged out successfully");
      router.push("/auth/login");
    } catch (err) {
      // Even if logout fails, clear local state
      setAuthToken(null);
      dispatch(clearUser());
      router.push("/auth/login");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-[#112032] flex flex-col justify-center items-center">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/feed" className="flex items-center space-x-2">
          <Image
            src="/assests/logo.svg"
            alt="Buddy Script"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
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
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-muted/50 rounded-full border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center space-x-1">
          {/* Home */}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/feed">
              <Home className="size-6" strokeWidth={1.5}/>
            </Link>
          </Button>

          {/* Friends */}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/friends">
              <Users className="size-6" strokeWidth={1.5}/>
            </Link>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-6" strokeWidth={1.5}/>
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </Button>

          {/* Messages */}
          <Button variant="ghost" size="icon" className="relative">
            <MessageCircle className="size-6" strokeWidth={1.5}/>
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-auto p-2 rounded-full hover:bg-muted">
                <div className="flex items-center gap-2 ">
                  <Avatar className="h-10 w-10 border-2 border-blue-500">
                    <AvatarImage src={user?.avatar?.url || "/assests/profile.png"} alt={user?.firstName} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block font-medium text-sm ">
                    {displayName}
                  </span> 
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="6"
                    fill="none"
                    viewBox="0 0 10 6"
                    className="hidden md:block"
                  >
                    <path
                      fill="currentColor"
                      d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z"
                    />
                  </svg>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-3 p-0 bg-white dark:bg-[#112032]">
              {/* Profile Section */}
              <div className="px-4 py-3 border-b ">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-12 w-12 border-2 border-blue-500">
                    <AvatarImage src={user?.avatar?.url || "/assests/profile.png"} alt={user?.firstName} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {displayName}
                    </p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="text-sm text-blue-500 hover:underline inline-block"
                >
                  View Profile
                </Link>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-3 px-4 py-2 cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <Settings className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-white">Settings</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="6"
                      height="10"
                      fill="none"
                      viewBox="0 0 6 10"
                      className="ml-auto opacity-50"
                    >
                      <path
                        fill="currentColor"
                        d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z"
                      />
                    </svg>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/help" className="flex items-center gap-3 px-4 py-2 cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-white">Help & Support</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="6"
                      height="10"
                      fill="none"
                      viewBox="0 0 6 10"
                      className="ml-auto opacity-50"
                    >
                      <path
                        fill="currentColor"
                        d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z"
                      />
                    </svg>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 cursor-pointer text-gray-600 w-full text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <LogOut className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-white">Log Out</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="6"
                      height="10"
                      fill="none"
                      viewBox="0 0 6 10"
                      className="ml-auto opacity-50"
                    >
                      <path
                        fill="currentColor"
                        d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z"
                      />
                    </svg>
                  </button>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

