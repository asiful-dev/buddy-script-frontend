"use client";

import { useInitUser } from "@/features/auth/services/me-loader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  useInitUser();
  return <>{children}</>;
}
