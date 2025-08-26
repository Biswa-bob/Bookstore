"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, Star } from "lucide-react"
import type { CartItem } from "@/lib/cart"

interface CartItemProps {
  item: CartItem
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
}

export function CartItemComponent({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { book, quantity } = item
  const itemTotal = book.price * quantity

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= book.stockCount) {
      onUpdateQuantity(item.id, newQuantity)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Book Cover */}
          <Link href={`/books/${book.id}`} className="flex-shrink-0">
            <div className="w-20 h-28 relative overflow-hidden rounded-md bg-muted">
              <Image
                src={book.coverImage || "/placeholder.svg"}
                alt={`${book.title} cover`}
                fill
                className="object-cover hover:scale-105 transition-transform"
              />
            </div>
          </Link>

          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Link href={`/books/${book.id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{book.rating}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {book.category}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)} className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Price and Quantity Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= book.stockCount}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground">{book.stockCount} available</span>
              </div>

              <div className="text-right">
                <div className="font-semibold">${itemTotal.toFixed(2)}</div>
                {book.originalPrice && (
                  <div className="text-xs text-muted-foreground line-through">${book.originalPrice}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
