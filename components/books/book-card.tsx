"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import type { Book } from "@/lib/books"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

interface BookCardProps {
  book: Book
  onAddToCart?: (book: Book) => void
}

export function BookCard({ book, onAddToCart }: BookCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem(book, 1)
    toast({
      title: "Added to Cart",
      description: `${book.title} has been added to your cart`,
    })

    // Still call the optional callback for any additional handling
    onAddToCart?.(book)
  }

  return (
    <Link href={`/books/${book.id}`}>
      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 h-full">
        <CardContent className="p-4">
          <div className="relative mb-4">
            <div className="aspect-[3/4] relative overflow-hidden rounded-md bg-muted">
              <Image
                src={book.coverImage || "/placeholder.svg"}
                alt={`${book.title} cover`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            {book.originalPrice && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                Sale
              </Badge>
            )}
            {!book.inStock && (
              <Badge variant="secondary" className="absolute top-2 left-2">
                Out of Stock
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>

            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{book.rating}</span>
              <span className="text-xs text-muted-foreground">({book.reviewCount.toLocaleString()})</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">${book.price}</span>
              {book.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">${book.originalPrice}</span>
              )}
            </div>

            <Badge variant="outline" className="text-xs">
              {book.category}
            </Badge>

            <Button size="sm" className="w-full mt-3" onClick={handleAddToCart} disabled={!book.inStock}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {book.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
