"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Smartphone, Lock, Shield } from 'lucide-react'
import { BookingData } from "@/app/booking/page"
import { createBooking } from "@/services/api/booking"
import { processPayment } from "@/services/api/payment"

interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  status: "available" | "occupied" | "maintenance" | "cleaning";
  floor: number;
  view: string;
  price: number;
  amenities: string[];
  imageLink?: string;
}

interface PaymentData {
  momoNumber: string;
}

interface PaymentRequest {
  method: "mtn_momo";
  amount: number;
  currency: string;
  momoNumber: string;
}

interface PaymentStepProps {
  data: BookingData & { selectedRoom?: Room };
  onUpdate: (data: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  setError: (error: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export default function PaymentStep({ data, onUpdate, onNext, onPrev, setError, setIsLoading }: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState(data.paymentMethod || 'mtn_momo')
  const [paymentData, setPaymentData] = useState<PaymentData>({
    momoNumber: "",
  })

  const calculateTotal = () => {
    if (!data.selectedRoom?.price || !data.checkIn || !data.checkOut) return 0
    
    const checkIn = new Date(data.checkIn)
    const checkOut = new Date(data.checkOut)
    
    // Ensure dates are valid
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return 0
    
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    if (nights <= 0) return 0
    
    return data.selectedRoom.price * nights
  }

  const total = calculateTotal()
  const tax = Math.round(total * 0.15) // 15% tax
  const finalTotal = total + tax

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }))
  }

  const validatePayment = () => {
    if (!paymentData.momoNumber.trim()) {
      setError("MTN MoMo number is required")
      return false
    }
    if (!/^6[578]\d{7}$/.test(paymentData.momoNumber.replace(/\s/g, ""))) {
      setError("Please enter a valid MTN MoMo number")
      return false
    }
    return true
  }

  const handlePayment = async () => {
    if (!validatePayment()) return

    setIsLoading(true)
    setError("")

    try {
      // Calculate nights and total
      const checkIn = new Date(data.checkIn)
      const checkOut = new Date(data.checkOut)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      const total = calculateTotal()
      const tax = Math.round(total * 0.15) // 15% tax
      const finalTotal = total + tax

      // Ensure guest details are present with required fields
      const guestDetails = {
        firstName: data.guestDetails?.firstName || 'Anonymous',
        lastName: data.guestDetails?.lastName || 'Guest',
        email: data.guestDetails?.email || 'anonymous@guest.com',
        phone: data.guestDetails?.phone || 'N/A',
        guestCount: data.guests || 1
      }

      // 1. Create Booking
      const bookingDataPayload = {
        roomNumber: data.selectedRoom?.roomNumber || '',
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guestDetails,
        paymentDetails: {
          method: paymentMethod,
          momoNumber: paymentData.momoNumber,
          amount: finalTotal,
          currency: 'FCFA'
        }
      }

      console.log('Sending booking creation data to backend:', {
        endpoint: 'http://localhost:5000/api/bookings/create',
        data: bookingDataPayload
      })

      const bookingResponse = await createBooking(bookingDataPayload as any)
      console.log('Booking creation response:', bookingResponse)

      // No separate payment processing call needed if backend handles payment status initially.
      // The backend should return the booking with its initial payment status (e.g., 'pending').

      onUpdate({
        paymentMethod,
        paymentDetails: paymentData,
        bookingNumber: bookingResponse.booking?.bookingNumber,
        cancellationCode: bookingResponse.booking?.cancellationCode,
      })

      onNext()
    } catch (error: any) {
      console.error('Error during booking or payment processing:', error)
      setError(error.message || "An unexpected error occurred during booking or payment.")
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
                  Payment Method
                </Label>
                <div className="flex items-center space-x-3 p-4 border rounded-lg bg-gray-50">
                  <Smartphone className="w-6 h-6 text-orange-500" aria-hidden="true" />
                  <div>
                    <p className="font-medium">MTN Mobile Money</p>
                    <p className="text-sm text-gray-500">Pay with your MTN MoMo account</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
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
                  aria-label={`Pay now - ${finalTotal.toLocaleString()} FCFA`}
                >
                  <Lock className="w-4 h-4 mr-2" aria-hidden="true" />
                  Pay Now - {finalTotal.toLocaleString()} FCFA
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
                  <span className="font-medium">{data.selectedRoom?.price?.toLocaleString() || '0'} FCFA/night</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Nights</span>
                  <span className="font-medium">
                    {data.checkIn && data.checkOut ? 
                      Math.ceil((new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 
                      0
                    }
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{total.toLocaleString()} FCFA</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-medium">{tax.toLocaleString()} FCFA</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-primary">Total</span>
                    <span className="text-lg font-medium text-primary">{finalTotal.toLocaleString()} FCFA</span>
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
