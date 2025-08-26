import type { CartItem } from "./cart"

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface PaymentMethod {
  type: "credit_card" | "debit_card" | "paypal"
  cardNumber?: string
  expiryMonth?: string
  expiryYear?: string
  cvv?: string
  cardholderName?: string
  paypalEmail?: string
}

export interface Order {
  id: string
  userId?: string
  items: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: Omit<PaymentMethod, "cardNumber" | "cvv"> // Don't store sensitive data
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  createdAt: Date
  updatedAt: Date
  trackingNumber?: string
  estimatedDelivery?: Date
  idempotencyKey: string
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: "pending" | "succeeded" | "failed"
  clientSecret: string
  idempotencyKey: string
}

// Mock order storage (in real app, this would be a database)
const mockOrders: Order[] = []
const mockPaymentIntents: PaymentIntent[] = []

export const ordersAPI = {
  async createPaymentIntent(amount: number, currency = "usd", idempotencyKey: string): Promise<PaymentIntent> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check for existing payment intent with same idempotency key
    const existingIntent = mockPaymentIntents.find((intent) => intent.idempotencyKey === idempotencyKey)
    if (existingIntent) {
      return existingIntent
    }

    const paymentIntent: PaymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
      status: "pending",
      clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      idempotencyKey,
    }

    mockPaymentIntents.push(paymentIntent)
    return paymentIntent
  },

  async confirmPayment(
    paymentIntentId: string,
    paymentMethod: PaymentMethod,
  ): Promise<{ success: boolean; error?: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const paymentIntent = mockPaymentIntents.find((intent) => intent.id === paymentIntentId)
    if (!paymentIntent) {
      return { success: false, error: "Payment intent not found" }
    }

    // Simulate payment processing (90% success rate)
    const success = Math.random() > 0.1

    if (success) {
      paymentIntent.status = "succeeded"
      return { success: true }
    } else {
      paymentIntent.status = "failed"
      return { success: false, error: "Payment failed. Please try again." }
    }
  },

  async createOrder(
    orderData: Omit<Order, "id" | "createdAt" | "updatedAt" | "status" | "paymentStatus">,
  ): Promise<Order> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Check for existing order with same idempotency key
    const existingOrder = mockOrders.find((order) => order.idempotencyKey === orderData.idempotencyKey)
    if (existingOrder) {
      return existingOrder
    }

    const order: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    }

    mockOrders.push(order)
    return order
  },

  async updateOrderStatus(orderId: string, status: Order["status"]): Promise<Order | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    const order = mockOrders.find((o) => o.id === orderId)
    if (!order) return null

    order.status = status
    order.updatedAt = new Date()

    if (status === "processing") {
      order.paymentStatus = "paid"
      order.trackingNumber = `TRK${Date.now()}`
    }

    return order
  },

  async getOrder(orderId: string): Promise<Order | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    return mockOrders.find((order) => order.id === orderId) || null
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return mockOrders
      .filter((order) => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },
}

export const orderUtils = {
  calculateOrderTotals: (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0)
    const shipping = subtotal > 50 ? 0 : 5.99
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + shipping + tax

    return { subtotal, shipping, tax, total }
  },

  generateIdempotencyKey: () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },

  formatOrderId: (orderId: string) => {
    return orderId.replace("order_", "").toUpperCase().slice(0, 8)
  },

  getOrderStatusColor: (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  },
}
