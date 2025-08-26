"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { BookCard } from "@/components/books/book-card"
import { BookFiltersComponent } from "@/components/books/book-filters"
import { BookSort } from "@/components/books/book-sort"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import type { Book, BookFilters, SortOption } from "@/lib/books"
import { booksAPI } from "@/lib/books"
import { useToast } from "@/hooks/use-toast"

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<BookFilters>({})
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const { toast } = useToast()

  // Load books
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true)
      try {
        const searchFilters = { ...filters, search: searchQuery || undefined }
        const fetchedBooks = await booksAPI.getBooks(searchFilters, sortBy)
        setBooks(fetchedBooks)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load books",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadBooks()
  }, [filters, sortBy, searchQuery, toast])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is handled by useEffect
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery("")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Browse Books</h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search books, authors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {/* Results and Sort */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">{loading ? "Loading..." : `${books.length} books found`}</p>
          <div className="flex items-center gap-4">
            <BookSort sortBy={sortBy} onSortChange={setSortBy} />

            {/* Mobile Filter Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <BookFiltersComponent filters={filters} onFiltersChange={setFilters} onClearFilters={clearFilters} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <BookFiltersComponent filters={filters} onFiltersChange={setFilters} onClearFilters={clearFilters} />
        </aside>

        {/* Books Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
          ) : books.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">No books found</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
