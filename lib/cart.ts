import type { Book } from "./books"

export interface CartItem {
  id: string
  book: Book
  quantity: number
  addedAt: Date
}

export interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

export const cartUtils = {
  calculateTotals: (items: CartItem[]): { totalItems: number; totalPrice: number } => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0)
    return { totalItems, totalPrice }
  },

  addItem: (items: CartItem[], book: Book, quantity = 1): CartItem[] => {
    const existingItemIndex = items.findIndex((item) => item.book.id === book.id)

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...items]
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
      }
      return updatedItems
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `${book.id}-${Date.now()}`,
        book,
        quantity,
        addedAt: new Date(),
      }
      return [...items, newItem]
    }
  },

  removeItem: (items: CartItem[], itemId: string): CartItem[] => {
    return items.filter((item) => item.id !== itemId)
  },

  updateQuantity: (items: CartItem[], itemId: string, quantity: number): CartItem[] => {
    if (quantity <= 0) {
      return cartUtils.removeItem(items, itemId)
    }

    return items.map((item) => (item.id === itemId ? { ...item, quantity } : item))
  },

  clearCart: (): CartItem[] => {
    return []
  },
}

// Cart storage utilities
export const cartStorage = {
  getCart(): CartItem[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem("bookstore-cart")
      if (!stored) return []

      const parsed = JSON.parse(stored)
      // Convert addedAt back to Date objects
      return parsed.map((item: any) => ({
        ...item,
        addedAt: new Date(item.addedAt),
      }))
    } catch (error) {
      console.error("Failed to load cart from storage:", error)
      return []
    }
  },

  setCart(items: CartItem[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem("bookstore-cart", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save cart to storage:", error)
    }
  },

  clearCart(): void {
    if (typeof window === "undefined") return

    try {
      localStorage.removeItem("bookstore-cart")
    } catch (error) {
      console.error("Failed to clear cart storage:", error)
    }
  },
}
