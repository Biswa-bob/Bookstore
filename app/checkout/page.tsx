"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { PaymentForm } from "@/components/checkout/payment-form"
import { OrderSummary } from "@/components/checkout/order-summary"
import { RoleGuard } from "@/components/auth/role-guard"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import type { ShippingAddress, PaymentMethod } from "@/lib/orders"
import { ordersAPI, orderUtils } from "@/lib/orders"

type CheckoutStep = "shipping" | "payment" | "processing"

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [idempotencyKey] = useState(() => orderUtils.generateIdempotencyKey())

  // Calculate order totals
  const { subtotal, shipping, tax, total } = orderUtils.calculateOrderTotals(items)

  // Redirect if cart is empty
  useEffect(() => {
    if (totalItems === 0) {
      router.push("/cart")
    }
  }, [totalItems, router])

  // Pre-fill shipping form with user data if available
  const initialShippingData = user
    ? {
        firstName: user.name.split(" ")[0] || "",
        lastName: user.name.split(" ").slice(1).join(" ") || "",
        email: user.email,
      }
    : undefined

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address)
    setCurrentStep("payment")
  }

  const handlePaymentSubmit = async (paymentMethod: PaymentMethod) => {
    if (!shippingAddress) return

    setIsLoading(true)
    setCurrentStep("processing")

    try {
      // Step 1: Create payment intent (idempotent)
      const paymentIntent = await ordersAPI.createPaymentIntent(
        Math.round(total * 100), // Convert to cents
        "usd",
        `${idempotencyKey}_payment`,
      )

      // Step 2: Confirm payment
      const paymentResult = await ordersAPI.confirmPayment(paymentIntent.id, paymentMethod)

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || "Payment failed")
      }

      // Step 3: Create order (idempotent)
      const order = await ordersAPI.createOrder({
        userId: user?.id,
        items,
        shippingAddress,
        paymentMethod: {
          type: paymentMethod.type,
          ...(paymentMethod.type !== "paypal" && {
            expiryMonth: paymentMethod.expiryMonth,
            expiryYear: paymentMethod.expiryYear,
            cardholderName: paymentMethod.cardholderName,
          }),
          ...(paymentMethod.type === "paypal" && {
            paypalEmail: paymentMethod.paypalEmail,
          }),
        },
        subtotal,
        shipping,
        tax,
        total,
        idempotencyKey,
      })

      // Step 4: Update order status to processing
      await ordersAPI.updateOrderStatus(order.id, "processing")

      // Step 5: Clear cart and redirect to success page
      clearCart()
      router.push(`/checkout/success?order=${order.id}`)

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${orderUtils.formatOrderId(order.id)} has been confirmed.`,
      })
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setCurrentStep("payment")
    } finally {
      setIsLoading(false)
    }
  }

  if (totalItems === 0) {
    return null // Will redirect via useEffect
  }

  return (
    <RoleGuard requiredRoles={["user", "admin"]}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "shipping" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <span className={currentStep === "shipping" ? "font-medium" : "text-muted-foreground"}>Shipping</span>
            </div>
            <div className="flex-1 h-px bg-border" />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "payment"
                    ? "bg-primary text-primary-foreground"
                    : shippingAddress
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {shippingAddress && currentStep !== "payment" ? <CheckCircle className="h-4 w-4" /> : "2"}
              </div>
              <span className={currentStep === "payment" ? "font-medium" : "text-muted-foreground"}>Payment</span>
            </div>
            <div className="flex-1 h-px bg-border" />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "processing" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                3
              </div>
              <span className={currentStep === "processing" ? "font-medium" : "text-muted-foreground"}>Review</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === "shipping" && (
              <ShippingForm onSubmit={handleShippingSubmit} initialData={initialShippingData} isLoading={isLoading} />
            )}

            {currentStep === "payment" && <PaymentForm onSubmit={handlePaymentSubmit} isLoading={isLoading} />}

            {currentStep === "processing" && (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Processing Your Order</h2>
                <p className="text-muted-foreground">Please don't close this page while we process your payment...</p>
              </div>
            )}

            {/* Back Button for Payment Step */}
            {currentStep === "payment" && (
              <div className="mt-6">
                <Button variant="outline" onClick={() => setCurrentStep("shipping")} disabled={isLoading}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Shipping
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <OrderSummary items={items} subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
