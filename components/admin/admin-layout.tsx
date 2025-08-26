"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Book, Menu, Package, Settings, ShoppingCart, Users, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { RoleGuard } from "@/components/auth/role-guard"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Books", href: "/admin/books", icon: Book },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Inventory", href: "/admin/inventory", icon: Package },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <RoleGuard requiredRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        {/* Mobile sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <AdminSidebar pathname={pathname} onLogout={handleLogout} />
          </SheetContent>
        </Sheet>

        {/* Desktop sidebar */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          <AdminSidebar pathname={pathname} onLogout={handleLogout} />
        </div>

        {/* Main content */}
        <div className="md:pl-64">
          <div className="flex flex-col">
            {/* Top bar */}
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1 items-center justify-between">
                  <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Admin</Badge>
                    <span className="text-sm text-muted-foreground">{user?.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Page content */}
            <main className="flex-1">
              <div className="py-6">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}

function AdminSidebar({ pathname, onLogout }: { pathname: string; onLogout: () => void }) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/admin" className="text-xl font-bold text-primary-foreground">
          BookStore Admin
        </Link>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                        isActive
                          ? "bg-primary-foreground text-primary"
                          : "text-primary-foreground hover:bg-primary-foreground/10",
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <Button
              variant="ghost"
              onClick={onLogout}
              className="w-full justify-start text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
