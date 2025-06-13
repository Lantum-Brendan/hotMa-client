"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import RoomSelectionStep from "@/components/booking/room-selection-step"
import GuestDetailsStep from "@/components/booking/guest-details-step"
import PaymentStep from "@/components/booking/payment-step"
import ConfirmationStep from "@/components/booking/confirmation-step"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Room } from "@/types/room"

export interface BookingData {
  step: number
  checkIn: string
  checkOut: string
  guests: number
  roomType: string
  selectedRoom?: Room
  guestDetails?: {
    firstName: string
    lastName: string
    email: string
    phone: string
    specialRequests?: string
  }
  paymentMethod?: string
  paymentDetails?: {
    momoNumber: string
  }
  bookingNumber?: string
  cancellationCode?: string
}

export default function BookingPage() {
  const searchParams = useSearchParams()
  const isReceptionistBooking = searchParams.get("receptionist") === "true";

  const [bookingData, setBookingData] = useState<BookingData>({
    step: 1,
    checkIn: isReceptionistBooking ? "" : searchParams.get("checkIn") || "",
    checkOut: isReceptionistBooking ? "" : searchParams.get("checkOut") || "",
    guests: Number(searchParams.get("guests")) || 1,
    roomType: searchParams.get("roomType") || "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Update booking data when URL parameters change
  useEffect(() => {
    setBookingData(prev => ({
      ...prev,
      checkIn: searchParams.get("checkIn") || prev.checkIn,
      checkOut: searchParams.get("checkOut") || prev.checkOut,
      guests: Number(searchParams.get("guests")) || prev.guests,
      roomType: searchParams.get("roomType") || prev.roomType,
    }))
  }, [searchParams])

  const handleUpdate = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    setBookingData(prev => ({ ...prev, step: prev.step + 1 }))
  }

  const handlePrev = () => {
    setBookingData(prev => ({ ...prev, step: prev.step - 1 }))
  }

  const renderStep = () => {
    switch (bookingData.step) {
      case 1:
        return (
          <RoomSelectionStep
            data={bookingData}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onPrev={handlePrev}
            setError={setError}
            setIsLoading={setIsLoading}
          />
        )
      case 2:
        return (
          <GuestDetailsStep
            data={bookingData}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onPrev={handlePrev}
            setError={setError}
            setIsLoading={setIsLoading}
          />
        )
      case 3:
        return (
          <PaymentStep
            data={bookingData}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onPrev={handlePrev}
            setError={setError}
            setIsLoading={setIsLoading}
          />
        )
      case 4:
        return (
          <ConfirmationStep
            data={bookingData}
            onUpdate={handleUpdate}
            onPrev={handlePrev}
            setError={setError}
            setIsLoading={setIsLoading}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-neutral font-roboto">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-medium text-primary text-center">
                {bookingData.step === 1 && "Select Your Room"}
                {bookingData.step === 2 && "Guest Details"}
                {bookingData.step === 3 && "Payment"}
                {bookingData.step === 4 && "Booking Confirmation"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md">
                  <p className="text-error text-sm font-normal" role="alert" aria-live="polite">
                    {error}
                  </p>
                </div>
              )}
              {renderStep()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
