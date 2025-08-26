"use client"

import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react"
import type { Book } from "@/lib/books"
import type { CartItem, CartState } from "@/lib/cart"
import { cartUtils, cartStorage } from "@/lib/cart"

interface CartContextType extends CartState {
  addItem: (book: Book, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: { book: Book; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } }
  | { type: "CLEAR_CART" }

function cartReducer(state: CartState & { isLoading: boolean }, action: CartAction) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "LOAD_CART": {
      const { totalItems, totalPrice } = cartUtils.calculateTotals(action.payload)
      return {
        ...state,
        items: action.payload,
        totalItems,
        totalPrice,
        isLoading: false,
      }
    }

    case "ADD_ITEM": {
      const newItems = cartUtils.addItem(state.items, action.payload.book, action.payload.quantity)
      const { totalItems, totalPrice } = cartUtils.calculateTotals(newItems)
      cartStorage.setCart(newItems)
      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      }
    }

    case "REMOVE_ITEM": {
      const newItems = cartUtils.removeItem(state.items, action.payload)
      const { totalItems, totalPrice } = cartUtils.calculateTotals(newItems)
      cartStorage.setCart(newItems)
      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      }
    }

    case "UPDATE_QUANTITY": {
      const newItems = cartUtils.updateQuantity(state.items, action.payload.itemId, action.payload.quantity)
      const { totalItems, totalPrice } = cartUtils.calculateTotals(newItems)
      cartStorage.setCart(newItems)
      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      }
    }

    case "CLEAR_CART": {
      cartStorage.clearCart()
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isLoading: true,
  })

  // Load cart from storage on mount
  useEffect(() => {
    const storedCart = cartStorage.getCart()
    dispatch({ type: "LOAD_CART", payload: storedCart })
  }, [])

  const addItem = (book: Book, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { book, quantity } })
  }

  const removeItem = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
