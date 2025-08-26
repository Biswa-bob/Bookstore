import type { Book } from "./books"
import { mockBooks } from "./books"

export interface AdminStats {
  totalBooks: number
  totalOrders: number
  totalRevenue: number
  lowStockBooks: number
}

export interface BookFormData {
  title: string
  author: string
  description: string
  price: number
  originalPrice?: number
  category: string
  isbn: string
  publishedDate: string
  publisher: string
  pages: number
  language: string
  coverImage: string
  stockCount: number
  tags: string[]
}

// Mock admin API functions
export const adminAPI = {
  async getStats(): Promise<AdminStats> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      totalBooks: mockBooks.length,
      totalOrders: 1247,
      totalRevenue: 45230.5,
      lowStockBooks: mockBooks.filter((book) => book.stockCount < 10).length,
    }
  },

  async createBook(bookData: BookFormData): Promise<Book> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newBook: Book = {
      id: Date.now().toString(),
      ...bookData,
      rating: 0,
      reviewCount: 0,
      inStock: bookData.stockCount > 0,
    }

    mockBooks.push(newBook)
    return newBook
  },

  async updateBook(id: string, bookData: Partial<BookFormData>): Promise<Book> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const bookIndex = mockBooks.findIndex((book) => book.id === id)
    if (bookIndex === -1) {
      throw new Error("Book not found")
    }

    const updatedBook = {
      ...mockBooks[bookIndex],
      ...bookData,
      inStock: (bookData.stockCount ?? mockBooks[bookIndex].stockCount) > 0,
    }

    mockBooks[bookIndex] = updatedBook
    return updatedBook
  },

  async deleteBook(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const bookIndex = mockBooks.findIndex((book) => book.id === id)
    if (bookIndex === -1) {
      throw new Error("Book not found")
    }

    mockBooks.splice(bookIndex, 1)
  },

  async uploadImage(file: File): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock image upload - in real app, this would upload to cloud storage
    return `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(file.name)}`
  },
}
