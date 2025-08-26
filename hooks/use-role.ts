"use client"

import { useAuth } from "@/contexts/auth-context"

export function useRole() {
  const { user } = useAuth()

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false

    if (Array.isArray(role)) {
      return role.includes(user.role)
    }

    return user.role === role
  }

  const isAdmin = (): boolean => hasRole("admin")
  const isUser = (): boolean => hasRole("user")
  const isAuthenticated = (): boolean => !!user

  return {
    user,
    hasRole,
    isAdmin,
    isUser,
    isAuthenticated,
    currentRole: user?.role || null,
  }
}
