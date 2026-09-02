import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { env } from "@/lib/env"

const publicRoutes = [
  "/",
  "/login",
  "/api/auth",
  "/to-vote",
  "/unidad",
]

export default async function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip middleware for API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: env.AUTH_SECRET })
  const isAuthenticated = !!token

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthenticated && pathname === "/login") {
    const dashboardUrl = new URL("/dashboard", req.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
