
import { NextResponse } from "next/server";
import { verifySession } from "./lib/session.js";

export async function proxy(request) {
  const token = request.cookies.get("admin_session")?.value;

  const session = token
    ? await verifySession(token)
    : null;

  const pathname = request.nextUrl.pathname;

  const protectedRoutes = [
    "/dashboard",
    "/students",
    "/add-student",
    "/attendance",
  ];

  const isProtected = protectedRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected && !session) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  if (pathname === "/login" && session) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/students/:path*",
    "/add-student/:path*",
    "/attendance/:path*",
    "/login",
  ],
};
