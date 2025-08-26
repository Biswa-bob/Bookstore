import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes and their required roles
const protectedRoutes = {
  "/admin": ["admin"],
  "/admin/books": ["admin"],
  "/admin/orders": ["admin"],
  "/admin/customers": ["admin"],
  "/admin/inventory": ["admin"],
  "/admin/settings": ["admin"],
  "/checkout": ["user", "admin"], // Requires authentication
  "/cart": ["user", "admin"], // Requires authentication
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route needs protection
  const requiredRoles = getRequiredRoles(pathname)
  if (!requiredRoles) {
    return NextResponse.next()
  }

  // Get user info from token (in real app, decode JWT)
  const token = request.cookies.get("access_token")?.value

  if (!token) {
    // Redirect to login if no token
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // In a real app, you would decode and validate the JWT token
  // For demo purposes, we'll simulate role checking
  const userRole = getUserRoleFromToken(token)

  if (!userRole || !requiredRoles.includes(userRole)) {
    // Redirect to unauthorized page or home
    const unauthorizedUrl = new URL("/unauthorized", request.url)
    return NextResponse.redirect(unauthorizedUrl)
  }

  return NextResponse.next()
}

function getRequiredRoles(pathname: string): string[] | null {
  // Check exact matches first
  if (protectedRoutes[pathname as keyof typeof protectedRoutes]) {
    return protectedRoutes[pathname as keyof typeof protectedRoutes]
  }

  // Check for nested admin routes
  if (pathname.startsWith("/admin")) {
    return ["admin"]
  }

  return null
}

function getUserRoleFromToken(token: string): string | null {
  // In a real app, decode JWT and extract role
  // For demo, we'll simulate based on token content
  try {
    // Mock role extraction - in real app, use jwt.decode()
    if (token.includes("admin")) {
      return "admin"
    }
    return "user"
  } catch {
    return null
  }
}

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*", "/cart/:path*"],
}
