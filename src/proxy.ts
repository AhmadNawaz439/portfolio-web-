import { NextResponse, type NextRequest } from "next/server";

// Quick check: send visitors without a session cookie to the login page.
// The real signature check happens on the server in lib/auth.ts.
export function proxy(request: NextRequest) {
  if (!request.cookies.has("admin_session")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
