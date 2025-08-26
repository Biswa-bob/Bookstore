"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookCard } from "@/components/books/book-card"
import Link from "next/link"
import { BookOpen, Star, TrendingUp } from "lucide-react"
import type { Book } from "@/lib/books"
import { booksAPI } from "@/lib/books"

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedBooks = async () => {
      try {
        const books = await booksAPI.getFeaturedBooks()
        setFeaturedBooks(books)
      } catch (error) {
        console.error("Failed to load featured books:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedBooks()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg mb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Your Next Great Read</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Browse thousands of books from bestsellers to hidden gems. Find your perfect book today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/books">Browse Books</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/register">Join Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <BookOpen className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Vast Collection</CardTitle>
            <CardDescription>Over 10,000 books across all genres and categories</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Star className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Curated Selections</CardTitle>
            <CardDescription>Hand-picked recommendations from our expert team</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <TrendingUp className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Trending Now</CardTitle>
            <CardDescription>Stay up-to-date with the latest bestsellers and new releases</CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Featured Books */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Books</h2>
          <Button variant="outline" asChild>
            <Link href="/books">View All</Link>
          </Button>
        </div>
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted rounded-md mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="bg-muted rounded-lg p-8">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-muted-foreground">Books Available</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
            <div className="text-muted-foreground">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">4.8★</div>
            <div className="text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </section>
    </div>
  )
}
