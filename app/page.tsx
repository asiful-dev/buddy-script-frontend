"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/libs/redux.config";
import { useInitUser } from "@/features/auth/services/me-loader";
import LoginView from "@/features/auth/components/login-view";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const initialized = useAppSelector((state) => state.auth.initialized);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  // Initialize user data on mount
  useInitUser();

  // Redirect to feed if authenticated
  useEffect(() => {
    if (initialized && isAuthenticated && user) {
      router.replace("/feed");
    }
  }, [initialized, isAuthenticated, user, router]);

  // Show loading state while checking authentication
  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F0F2F5] dark:bg-[#232E42]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div>
        <LoginView />
      </div>
    );
  }

  // This should not be reached as we redirect above, but just in case
  return null;
}
