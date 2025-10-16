import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Jika belum login dan mencoba akses dashboard
  if (!token && pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah login tapi buka /login, arahkan ke dashboard
  if (token && pathname === "/login") {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Tentukan rute yang akan diproteksi
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
