import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register"];
const PROTECTED_ROUTES = ["/feed"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  // If accessing protected route without token, redirect to login
  // Note: For /feed, we allow access and let client-side handle auth check
  // This is because localStorage token needs to be synced to cookie client-side
  if (isProtected && !accessToken && pathname !== "/feed") {
    const url = new URL("/auth/login", req.url);
    return NextResponse.redirect(url);
  }

  // For /feed specifically, allow access and let client-side handle redirect if needed
  if (pathname === "/feed" && !accessToken) {
    // Allow through - AuthSync component will handle redirect if no token
    return NextResponse.next();
  }

  // If accessing public route with token, redirect to feed
  if (isPublic && accessToken) {
    const url = new URL("/feed", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/feed/:path*",
    "/feed"
  ],
};
