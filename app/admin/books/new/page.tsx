"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { BookForm } from "@/components/admin/book-form"
import { useRouter } from "next/navigation"

export default function NewBookPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/admin/books")
  }

  const handleCancel = () => {
    router.push("/admin/books")
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold">Add New Book</h1>
            <p className="text-muted-foreground">Create a new book entry for your catalog.</p>
          </div>

          {/* Book Form */}
          <BookForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    </AdminLayout>
  )
}
