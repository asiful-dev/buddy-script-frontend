"use client";

import { useInitUser } from "@/features/auth/services/me-loader";
import { AuthSync } from "./components/AuthSync";

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  useInitUser();
  return (
    <>
      <AuthSync />
      {children}
    </>
  );
}
