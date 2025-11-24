import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register"];
const PROTECTED_ROUTES = ["/feed"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isProtected = PROTECTED_ROUTES.includes(pathname);

  if (isProtected && !accessToken) {
    const url = new URL("/auth/login", req.url);
    return NextResponse.redirect(url);
  }

  if (isPublic && accessToken) {
    const url = new URL("/feed", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/feed/:path*"],
};
