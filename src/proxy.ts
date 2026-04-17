import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const pathname = req.nextUrl.pathname;

    // Define Route Categories
    const isAdminRoute = pathname.startsWith("/admin");
    const isStudentRoute = 
      pathname.startsWith("/profile") || 
      pathname.startsWith("/chat") || 
      pathname.startsWith("/lessons");
    
    const isLoginRoute = pathname.startsWith("/login") || pathname.startsWith("/signup");

    // 1. Logic for Authenticated users on Login/Signup pages
    if (isLoginRoute && isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 2. Logic for Admin Routes
    if (isAdminRoute) {
      const role = (token?.role as string)?.toLowerCase();
      if (!isAuth || role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // 3. Logic for Protected Student Routes
    if (isStudentRoute && !isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // This ensures the middleware always executes even if withAuth doesn't find a token,
      // allowing us to handle the logic manually inside the function above.
      authorized: () => true,
    },
  }
);

export const config = {
  // Protect all necessary paths while ignoring static files, api routes, and public assets
  matcher: [
    "/profile/:path*", 
    "/chat/:path*", 
    "/lessons/:path*", 
    "/admin/:path*",
    "/login",
    "/signup"
  ],
};
