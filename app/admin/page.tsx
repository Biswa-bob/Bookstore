"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { StatsCards } from "@/components/admin/stats-cards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Book, TrendingUp, Users, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { adminAPI, type AdminStats } from "@/lib/admin"
import { mockBooks } from "@/lib/books"

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminAPI.getStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to load stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded" />
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-64 bg-muted rounded" />
              <div className="h-64 bg-muted rounded" />
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Failed to load dashboard data.</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const lowStockBooks = mockBooks.filter((book) => book.stockCount < 10)
  const recentBooks = mockBooks.slice(0, 5)

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your bookstore.</p>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-20 flex-col gap-2">
              <Link href="/admin/books/new">
                <Book className="h-6 w-6" />
                Add New Book
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Link href="/admin/orders">
                <ShoppingCart className="h-6 w-6" />
                View Orders
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Link href="/admin/inventory">
                <TrendingUp className="h-6 w-6" />
                Manage Inventory
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Link href="/admin/customers">
                <Users className="h-6 w-6" />
                View Customers
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Low Stock Alert */}
            {lowStockBooks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <TrendingUp className="h-5 w-5" />
                    Low Stock Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockBooks.slice(0, 5).map((book) => (
                      <div key={book.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-muted-foreground">by {book.author}</p>
                        </div>
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          {book.stockCount} left
                        </Badge>
                      </div>
                    ))}
                    {lowStockBooks.length > 5 && (
                      <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                        <Link href="/admin/inventory">View All ({lowStockBooks.length - 5} more)</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Books */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Recent Books
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{book.title}</p>
                        <p className="text-sm text-muted-foreground">by {book.author}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${book.price}</p>
                        <Badge variant={book.inStock ? "default" : "secondary"}>
                          {book.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                    <Link href="/admin/books">View All Books</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
