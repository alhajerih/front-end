import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUser } from "./lib/token";

export async function middleware(request: NextRequest) {
  const isLoggedIn = await getUser(); // Replace with your actual auth logic
  console.log(isLoggedIn);
  const pathname = request.nextUrl.pathname;
  // Allow access to /signup and /signin without redirection
  if (pathname === "/signup" || pathname === "/signin") {
    return NextResponse.next();
  }
  // Redirect unauthenticated users trying to access any other page to /signin
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  // Allow access if logged in
  return NextResponse.next();
}

// Apply middleware only to specific routes
export const config = {
  matcher: ["/"], // Only apply middleware to these routes
};
