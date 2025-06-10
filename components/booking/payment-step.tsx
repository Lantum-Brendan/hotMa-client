"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Smartphone, Lock, Shield } from 'lucide-react'
import { BookingData } from "@/app/booking/page"

interface PaymentStepProps {
  data: BookingData
  onUpdate: (data: Partial<BookingData>) => void
  onNext: () => void
  onPrev: () => void
  setError: (error: string) => void
  setIsLoading: (loading: boolean) => void
}

export default function PaymentStep({ data, onUpdate, onNext, onPrev, setError, setIsLoading }: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState("momo")
  const [paymentData, setPaymentData] = useState({
    // MTN MoMo
    momoNumber: "",
    
    // Visa
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  const calculateTotal = () => {
    if (!data.selectedRoom || !data.checkIn || !data.checkOut) return 0
    
    const checkIn = new Date(data.checkIn)
    const checkOut = new Date(data.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    
    return data.selectedRoom.price * nights
  }

  const total = calculateTotal()
  const tax = Math.round(total * 0.15) // 15% tax
  const finalTotal = total + tax

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }))
  }

  const validatePayment = () => {
    if (paymentMethod === "momo") {
      if (!paymentData.momoNumber.trim()) {
        setError("MTN MoMo number is required")
        return false
      }
      if (!/^[0-9]{10}$/.test(paymentData.momoNumber.replace(/\s/g, ""))) {
        setError("Please enter a valid 10-digit MTN MoMo number")
        return false
      }
    } else if (paymentMethod === "visa") {
      if (!paymentData.cardNumber.trim()) {
        setError("Card number is required")
        return false
      }
      if (!paymentData.expiryDate.trim()) {
        setError("Expiry date is required")
        return false
      }
      if (!paymentData.cvv.trim()) {
        setError("CVV is required")
        return false
      }
      if (!paymentData.cardholderName.trim()) {
        setError("Cardholder name is required")
        return false
      }
    }
    return true
  }

  const handlePayment = async () => {
    if (!validatePayment()) return

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call to /api/payments/process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate payment failure for demonstration
      if (Math.random() > 0.8) {
        setError("Payment failed. Please check your payment details and try again.")
        setIsLoading(false)
        return
      }

      // Generate booking confirmation
      const bookingNumber = `HM${Date.now().toString().slice(-6)}`
      const cancellationCode = `CX${Math.random().toString(36).substr(2, 8).toUpperCase()}`

      onUpdate({
        paymentMethod,
        paymentDetails: paymentData,
        bookingNumber,
        cancellationCode,
      })

      onNext()
    } catch (error) {
      setError("Payment processing failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <Card className="bg-accent/50 border-accent">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center space-x-4">
              <span><strong>Guest:</strong> {data.guestDetails?.firstName} {data.guestDetails?.lastName}</span>
              <span><strong>Room:</strong> {data.selectedRoom?.type}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              className="border-primary text-primary hover:bg-primary hover:text-white"
              aria-label="Go back to guest details"
            >
              <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
              Edit Details
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-medium text-primary">Secure Payment</CardTitle>
              <p className="text-gray-600">Complete your booking with secure payment</p>
            </CardHeader>
            <CardContent className="p-8">
              {/* Payment Method Selection */}
              <div className="mb-8">
                <Label className="text-lg font-medium text-gray-700 mb-4 block">
                  Choose Payment Method
                </Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="momo" id="momo" />
                    <Label htmlFor="momo" className="flex items-center space-x-3 cursor-pointer flex-1">
                      <Smartphone className="w-6 h-6 text-orange-500" aria-hidden="true" />
                      <div>
                        <p className="font-medium">MTN Mobile Money</p>
                        <p className="text-sm text-gray-500">Pay with your MTN MoMo account</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="visa" id="visa" />
                    <Label htmlFor="visa" className="flex items-center space-x-3 cursor-pointer flex-1">
                      <CreditCard className="w-6 h-6 text-blue-500" aria-hidden="true" />
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard, and other cards</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment Details */}
              {paymentMethod === "momo" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="momo-number" className="text-sm font-medium text-gray-700">
                      MTN MoMo Number *
                    </Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                      <Input
                        id="momo-number"
                        type="tel"
                        value={paymentData.momoNumber}
                        onChange={(e) => handleInputChange("momoNumber", e.target.value)}
                        className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                        placeholder="0XX XXX XXXX"
                        aria-label="MTN MoMo number"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "visa" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number" className="text-sm font-medium text-gray-700">
                      Card Number *
                    </Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                      <Input
                        id="card-number"
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                        className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                        placeholder="1234 5678 9012 3456"
                        aria-label="Card number"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry-date" className="text-sm font-medium text-gray-700">
                        Expiry Date *
                      </Label>
                      <Input
                        id="expiry-date"
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                        className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                        placeholder="MM/YY"
                        aria-label="Card expiry date"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                        CVV *
                      </Label>
                      <Input
                        id="cvv"
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value)}
                        className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                        placeholder="123"
                        aria-label="Card CVV"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardholder-name" className="text-sm font-medium text-gray-700">
                      Cardholder Name *
                    </Label>
                    <Input
                      id="cardholder-name"
                      type="text"
                      value={paymentData.cardholderName}
                      onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                      className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                      placeholder="Name as it appears on card"
                      aria-label="Cardholder name"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-500" aria-hidden="true" />
                  <span>Your payment information is encrypted and secure</span>
                </div>
              </div>

              {/* Pay Button */}
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={handlePayment}
                  className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 h-12 text-base font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl min-w-[200px]"
                  aria-label={`Pay now - $${finalTotal}`}
                >
                  <Lock className="w-4 h-4 mr-2" aria-hidden="true" />
                  Pay Now - ${finalTotal}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-4">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-primary">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Rate</span>
                  <span className="font-medium">${data.selectedRoom?.price}/night</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Nights</span>
                  <span className="font-medium">
                    {Math.ceil((new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${total}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-medium">${tax}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-primary">Total</span>
                    <span className="text-lg font-medium text-primary">${finalTotal}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-accent/30 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Booking Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Room:</strong> {data.selectedRoom?.type}</p>
                  <p><strong>Check-in:</strong> {new Date(data.checkIn).toLocaleDateString()}</p>
                  <p><strong>Check-out:</strong> {new Date(data.checkOut).toLocaleDateString()}</p>
                  <p><strong>Guests:</strong> {data.guests}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
