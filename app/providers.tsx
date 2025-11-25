"use client";

import ReduxProvider from "@/providers/redux.provider";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/shared/components/ToastProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
