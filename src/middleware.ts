import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const publicRoutes = ["/", "/login", "/api/auth/*", "/asambleas/*"]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  const isPublicRoute = publicRoutes.some((route) => {
    if (route.endsWith("*")) {
      return pathname.startsWith(route.replace("*", ""))
    }
    return pathname === route
  })

  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthenticated && pathname === "/login") {
    const dashboardUrl = new URL("/dashboard", req.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
