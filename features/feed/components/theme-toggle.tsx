"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="relative w-14 h-28 bg-blue-500 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "
        aria-label="Toggle theme"
      >
        {/* Toggle Switch Track */}
        <div className="absolute inset-0 rounded-full overflow-hidden flex flex-col items-center justify-center">
          {/* Icons Container */}
          <div
            className={`absolute inset-x-0 flex flex-col gap-4 items-center justify-between p-2 transition-transform duration-300 ${
              isDark ? "translate-y-0" : "translate-y-0"
            }`}
          >
            {/* Sun Icon (Light Mode) - Top */}
            <div
              className={`size-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                !isDark
                  ? "bg-white scale-110 opacity-100"
                  : "bg-transparent opacity-50 scale-90"
              }`}
            >
              <Sun
                className={`size-6 ${!isDark ? "text-blue-500" : "text-white"}`}
                strokeWidth={2}
              />
            </div>

            {/* Moon Icon (Dark Mode) - Bottom */}
            <div
              className={`size-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                isDark
                  ? "bg-white scale-110 opacity-100"
                  : "bg-transparent opacity-50 scale-90"
              }`}
            >
              <Moon
                className={`size-6 ${isDark ? "text-blue-500" : "text-white"}`}
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        
      </button>
    </div>
  );
}

