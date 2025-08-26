"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock } from "lucide-react"
import type { PaymentMethod } from "@/lib/orders"

interface PaymentFormProps {
  onSubmit: (paymentMethod: PaymentMethod) => void
  isLoading?: boolean
}

export function PaymentForm({ onSubmit, isLoading }: PaymentFormProps) {
  const [paymentType, setPaymentType] = useState<PaymentMethod["type"]>("credit_card")
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
    paypalEmail: "",
  })
  const [errors, setErrors] = useState<Partial<typeof formData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<typeof formData> = {}

    if (paymentType === "credit_card" || paymentType === "debit_card") {
      if (!formData.cardNumber.replace(/\s/g, "")) {
        newErrors.cardNumber = "Card number is required"
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Invalid card number"
      }

      if (!formData.expiryMonth) newErrors.expiryMonth = "Expiry month is required"
      if (!formData.expiryYear) newErrors.expiryYear = "Expiry year is required"

      if (!formData.cvv) {
        newErrors.cvv = "CVV is required"
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "Invalid CVV"
      }

      if (!formData.cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required"
    } else if (paymentType === "paypal") {
      if (!formData.paypalEmail.trim()) {
        newErrors.paypalEmail = "PayPal email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.paypalEmail)) {
        newErrors.paypalEmail = "Invalid email address"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const paymentMethod: PaymentMethod = {
        type: paymentType,
        ...(paymentType !== "paypal" && {
          cardNumber: formData.cardNumber.replace(/\s/g, ""),
          expiryMonth: formData.expiryMonth,
          expiryYear: formData.expiryYear,
          cvv: formData.cvv,
          cardholderName: formData.cardholderName,
        }),
        ...(paymentType === "paypal" && {
          paypalEmail: formData.paypalEmail,
        }),
      }
      onSubmit(paymentMethod)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    let processedValue = value

    // Format card number with spaces
    if (field === "cardNumber") {
      processedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .slice(0, 19)
    }

    // Only allow digits for CVV
    if (field === "cvv") {
      processedValue = value.replace(/\D/g, "").slice(0, 4)
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i)
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-1 gap-3">
              <div
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  paymentType === "credit_card" ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => setPaymentType("credit_card")}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentType"
                    value="credit_card"
                    checked={paymentType === "credit_card"}
                    onChange={() => setPaymentType("credit_card")}
                    className="text-primary"
                  />
                  <CreditCard className="h-4 w-4" />
                  <span>Credit Card</span>
                </div>
              </div>
              <div
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  paymentType === "debit_card" ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => setPaymentType("debit_card")}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentType"
                    value="debit_card"
                    checked={paymentType === "debit_card"}
                    onChange={() => setPaymentType("debit_card")}
                    className="text-primary"
                  />
                  <CreditCard className="h-4 w-4" />
                  <span>Debit Card</span>
                </div>
              </div>
              <div
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  paymentType === "paypal" ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => setPaymentType("paypal")}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentType"
                    value="paypal"
                    checked={paymentType === "paypal"}
                    onChange={() => setPaymentType("paypal")}
                    className="text-primary"
                  />
                  <div className="w-4 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    P
                  </div>
                  <span>PayPal</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Card Payment Form */}
          {(paymentType === "credit_card" || paymentType === "debit_card") && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name *</Label>
                <Input
                  id="cardholderName"
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                  disabled={isLoading}
                  className={errors.cardholderName ? "border-destructive" : ""}
                  placeholder="John Doe"
                />
                {errors.cardholderName && <p className="text-sm text-destructive">{errors.cardholderName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                  disabled={isLoading}
                  className={errors.cardNumber ? "border-destructive" : ""}
                  placeholder="1234 5678 9012 3456"
                />
                {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryMonth">Month *</Label>
                  <Select
                    value={formData.expiryMonth}
                    onValueChange={(value) => handleInputChange("expiryMonth", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className={errors.expiryMonth ? "border-destructive" : ""}>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.expiryMonth && <p className="text-sm text-destructive">{errors.expiryMonth}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryYear">Year *</Label>
                  <Select
                    value={formData.expiryYear}
                    onValueChange={(value) => handleInputChange("expiryYear", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className={errors.expiryYear ? "border-destructive" : ""}>
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.expiryYear && <p className="text-sm text-destructive">{errors.expiryYear}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    disabled={isLoading}
                    className={errors.cvv ? "border-destructive" : ""}
                    placeholder="123"
                  />
                  {errors.cvv && <p className="text-sm text-destructive">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          )}

          {/* PayPal Form */}
          {paymentType === "paypal" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paypalEmail">PayPal Email *</Label>
                <Input
                  id="paypalEmail"
                  type="email"
                  value={formData.paypalEmail}
                  onChange={(e) => handleInputChange("paypalEmail", e.target.value)}
                  disabled={isLoading}
                  className={errors.paypalEmail ? "border-destructive" : ""}
                  placeholder="your@email.com"
                />
                {errors.paypalEmail && <p className="text-sm text-destructive">{errors.paypalEmail}</p>}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "Processing Payment..." : "Complete Order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
