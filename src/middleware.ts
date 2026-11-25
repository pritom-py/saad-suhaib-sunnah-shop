import { NextResponse, type NextRequest } from "next/server";

/**
 * First gate only: bounce visitors without an admin cookie. The signature and the user
 * are verified server-side by requireAdmin() in every admin page and action.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname !== "/admin/login" && !request.cookies.get("saad_admin_session")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
