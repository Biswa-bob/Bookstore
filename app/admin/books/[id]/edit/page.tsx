"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { BookForm } from "@/components/admin/book-form"
import { useRouter } from "next/navigation"
import { booksAPI, type Book } from "@/lib/books"

interface EditBookPageProps {
  params: { id: string }
}

export default function EditBookPage({ params }: EditBookPageProps) {
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBook = async () => {
      try {
        const data = await booksAPI.getBook(params.id)
        setBook(data)
      } catch (error) {
        console.error("Failed to load book:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBook()
  }, [params.id])

  const handleSuccess = () => {
    router.push("/admin/books")
  }

  const handleCancel = () => {
    router.push("/admin/books")
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!book) {
    return (
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
            <p className="text-muted-foreground">The book you're looking for doesn't exist.</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold">Edit Book</h1>
            <p className="text-muted-foreground">Update the details for "{book.title}".</p>
          </div>

          {/* Book Form */}
          <BookForm book={book} onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    </AdminLayout>
  )
}
